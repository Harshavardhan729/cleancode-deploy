import * as vscode from 'vscode';
import { AutoFixEngine } from '../services/AutoFixEngine';
import { GlobPatternBuilder } from '../utils/GlobPatternBuilder';
import { FileFilterService } from '../services/FileFilterService';
import { Logger } from '../utils/Logger';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';
import { ConfigurationService } from '../services/ConfigurationService';
import { AutoFixFactory } from '../fixers/AutoFixFactory';
import { StatusBarService } from '../services/StatusBarService';
import { AutoFixStatisticsService } from '../services/AutoFixStatisticsService';

export class AutoFixWorkspaceCommand {

    public static readonly commandId =
        'cleancode-deploy.autoFixWorkspace';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            AutoFixWorkspaceCommand.commandId,
            async () => {

                if (!ConfigurationService.isAutoFixEnabled()) {

                    vscode.window.showWarningMessage(
                        'Auto Fix is disabled in CleanCode Deploy settings.'
                    );

                    return;

                }

                if (!AutoFixFactory.hasAnyEnabledFixers()) {

                    vscode.window.showWarningMessage(
                        'No Auto Fix rules are enabled.'
                    );

                    return;

                }

                const confirmation =
                    await vscode.window.showWarningMessage(
                        'Auto Fix will modify files in your workspace. Do you want to continue?',
                        {
                            modal: true
                        },
                        'Continue'
                    );

                if (confirmation !== 'Continue') {
                    return;
                }

                const workspaceFolders =
                    vscode.workspace.workspaceFolders;

                if (!workspaceFolders || workspaceFolders.length === 0) {

                    vscode.window.showWarningMessage(
                        'No workspace is currently open.'
                    );

                    return;

                }

                const excludePattern =
                    GlobPatternBuilder.buildExcludePattern();

                const files =
                    await vscode.workspace.findFiles(
                        '**/*',
                        excludePattern
                    );

                let fixedFiles = 0;
                let totalFixes = 0;

                const totalBreakdown =
                    new Map<string, number>();

                const totalCategoryBreakdown =
                    new Map<string, number>();

                const totalSeverityBreakdown =
                    new Map<string, number>();

                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: 'CleanCode Deploy Auto Fix',
                        cancellable: true
                    },
                    async (progress, token) => {

                        let processedFiles = 0;

                        for (const file of files) {

                            if (token.isCancellationRequested) {

                                Logger.warning(
                                    'Auto Fix cancelled by user.'
                                );

                                vscode.window.showInformationMessage(
                                    'Auto Fix cancelled.'
                                );

                                break;

                            }

                            if (!FileFilterService.isSupported(file.fsPath)) {
                                continue;
                            }

                            processedFiles++;

                            progress.report({
                                message: `Fixing file ${processedFiles}...`
                            });

                            const result =
                                await AutoFixEngine.fixFile(file);

                            if (result.modified) {
                                fixedFiles++;
                            }

                            totalFixes +=
                                result.appliedFixes;

                            result.fixBreakdown.forEach(
                                (count, fixerName) => {

                                    totalBreakdown.set(
                                        fixerName,
                                        (totalBreakdown.get(fixerName) ?? 0) +
                                        count
                                    );

                                }
                            );

                            result.categoryBreakdown.forEach(
                                (count, category) => {

                                    totalCategoryBreakdown.set(
                                        category,
                                        (totalCategoryBreakdown.get(category) ??
                                            0) + count
                                    );

                                }
                            );

                            result.severityBreakdown.forEach(
                                (count, severity) => {

                                    totalSeverityBreakdown.set(
                                        severity,
                                        (totalSeverityBreakdown.get(severity) ??
                                            0) + count
                                    );

                                }
                            );

                        }

                    }
                );

                Logger.info('==============================');
                Logger.info('Auto Fix Summary');
                Logger.info('==============================');

                Logger.info(
                    `Maximum Auto Fix Severity: ${ConfigurationService.getMaximumAutoFixSeverity()
                    }`
                );

                Logger.info(`Files Modified: ${fixedFiles}`);
                Logger.info(`Fixes Applied: ${totalFixes}`);

                Logger.info(
                    `Backup Folder: ${workspaceFolders[0].uri.fsPath}\\.cleancode-backups`
                );

                StatusBarService.autoFixCompleted(
                    totalFixes
                );

                await AutoFixStatisticsService.update(
                    fixedFiles,
                    totalFixes
                );

                Logger.info('==============================');
                Logger.info('Auto Fix Breakdown');
                Logger.info('==============================');

                if (totalBreakdown.size === 0) {

                    Logger.info('No fixes were applied.');

                } else {

                    totalBreakdown.forEach(
                        (count, fixerName) => {

                            Logger.info(
                                `${fixerName}: ${count}`
                            );

                        }
                    );

                }

                Logger.info('==============================');
                Logger.info('Category Breakdown');
                Logger.info('==============================');

                if (totalCategoryBreakdown.size === 0) {

                    Logger.info('No categories recorded.');

                } else {

                    totalCategoryBreakdown.forEach(
                        (count, category) => {

                            Logger.info(
                                `${category}: ${count}`
                            );

                        }
                    );

                }

                Logger.info('==============================');
                Logger.info('Severity Breakdown');
                Logger.info('==============================');

                if (totalSeverityBreakdown.size === 0) {

                    Logger.info('No severities recorded.');

                } else {

                    totalSeverityBreakdown.forEach(
                        (count, severity) => {

                            Logger.info(
                                `${severity}: ${count}`
                            );

                        }
                    );

                }

                const action =
                    await vscode.window.showInformationMessage(
                        `Auto Fix completed. Files modified: ${fixedFiles}, Fixes applied: ${totalFixes}`,
                        'Show Details'
                    );

                if (action === 'Show Details') {

                    const ruleDetails =
                        Array.from(totalBreakdown.entries())
                            .map(
                                ([fixerName, count]) =>
                                    `${fixerName}: ${count}`
                            )
                            .join('\n');

                    const categoryDetails =
                        Array.from(
                            totalCategoryBreakdown.entries()
                        )
                            .map(
                                ([category, count]) =>
                                    `${category}: ${count}`
                            )
                            .join('\n');

                    const severityDetails =
                        Array.from(
                            totalSeverityBreakdown.entries()
                        )
                            .map(
                                ([severity, count]) =>
                                    `${severity}: ${count}`
                            )
                            .join('\n');

                    const details = [
                        `Maximum Severity: ${ConfigurationService.getMaximumAutoFixSeverity()
                        }`,
                        '',
                        'Rule Breakdown',
                        '----------------',
                        ruleDetails || 'No fixes were applied.',
                        '',
                        'Category Breakdown',
                        '------------------',
                        categoryDetails || 'No categories recorded.',
                        '',
                        'Severity Breakdown',
                        '------------------',
                        severityDetails || 'No severities recorded.'
                    ].join('\n');

                    vscode.window.showInformationMessage(
                        details,
                        {
                            modal: true
                        }
                    );

                }

                if (fixedFiles > 0) {

                    await new Promise(resolve =>
                        setTimeout(resolve, 3000)
                    );

                    const scanner =
                        new WorkspaceScannerService();

                    await scanner.scan();

                }

            }
        );

        context.subscriptions.push(
            disposable
        );

    }

}