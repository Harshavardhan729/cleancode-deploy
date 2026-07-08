import * as vscode from 'vscode';
import { AutoFixEngine } from '../services/AutoFixEngine';
import { GlobPatternBuilder } from '../utils/GlobPatternBuilder';
import { FileFilterService } from '../services/FileFilterService';
import { Logger } from '../utils/Logger';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';
import { ConfigurationService } from '../services/ConfigurationService';

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

                                Logger.warning('Auto Fix cancelled by user.');

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

                            totalFixes += result.appliedFixes;

                            result.fixBreakdown.forEach((count, fixerName) => {

                                totalBreakdown.set(
                                    fixerName,
                                    (totalBreakdown.get(fixerName) ?? 0) + count
                                );

                            });

                        }

                    }
                );

                Logger.info('==============================');
                Logger.info('Auto Fix Summary');
                Logger.info('==============================');
                Logger.info(`Files Modified: ${fixedFiles}`);
                Logger.info(`Fixes Applied: ${totalFixes}`);

                Logger.info('==============================');
                Logger.info('Auto Fix Breakdown');
                Logger.info('==============================');

                totalBreakdown.forEach((count, fixerName) => {

                    Logger.info(`${fixerName}: ${count}`);

                });

                const action =
                    await vscode.window.showInformationMessage(
                        `Auto Fix completed. Files modified: ${fixedFiles}, Fixes applied: ${totalFixes}`,
                        'Show Details'
                    );

                if (action === 'Show Details') {

                    const details =
                        Array.from(totalBreakdown.entries())
                            .map(
                                ([fixerName, count]) =>
                                    `${fixerName}: ${count}`
                            )
                            .join('\n');

                    vscode.window.showInformationMessage(
                        details || 'No fixes were applied.',
                        {
                            modal: true
                        }
                    );

                }

                if (fixedFiles > 0) {

                    const scanner =
                        new WorkspaceScannerService();

                    await scanner.scan();

                }

            }
        );

        context.subscriptions.push(disposable);

    }

}