import * as vscode from 'vscode';
import * as path from 'path';

import { AutoFixEngine } from '../services/AutoFixEngine';
import { GlobPatternBuilder } from '../utils/GlobPatternBuilder';
import { FileFilterService } from '../services/FileFilterService';
import { Logger } from '../utils/Logger';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';
import { ConfigurationService } from '../services/ConfigurationService';
import { AutoFixFactory } from '../fixers/AutoFixFactory';
import { StatusBarService } from '../services/StatusBarService';
import { AutoFixStatisticsService } from '../services/AutoFixStatisticsService';
import { LanguageDetector } from '../services/LanguageDetector';

import { PreviewReport } from '../models/PreviewReport';
import { AutoFixSeverity } from '../models/AutoFixSeverity';

export class AutoFixWorkspaceCommand {

    public static readonly commandId =
        'cleancode-deploy.autoFixWorkspace';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable =
            vscode.commands.registerCommand(
                AutoFixWorkspaceCommand.commandId,
                async () => {

                    if (
                        !ConfigurationService.isAutoFixEnabled()
                    ) {

                        vscode.window.showWarningMessage(
                            'Auto Fix is disabled in CleanCode Deploy settings.'
                        );

                        return;
                    }

                    if (
                        !AutoFixFactory.hasAnyEnabledFixers()
                    ) {

                        vscode.window.showWarningMessage(
                            'No Auto Fix rules are enabled.'
                        );

                        return;
                    }

                    const workspaceFolders =
                        vscode.workspace.workspaceFolders;

                    if (
                        !workspaceFolders ||
                        workspaceFolders.length === 0
                    ) {

                        vscode.window.showWarningMessage(
                            'No workspace is currently open.'
                        );

                        return;
                    }

                    const activeProfile =
                        ConfigurationService.getAutoFixProfile();

                    const maximumSeverity =
                        ConfigurationService.getProfileSeverity();

                    const previewOnly =
                        ConfigurationService.isAutoFixPreviewOnly();

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            [
                                previewOnly
                                    ? 'Auto Fix will preview changes without modifying files.'
                                    : 'Auto Fix will modify files in your workspace.',
                                '',
                                `Profile: ${activeProfile}`,
                                `Maximum Severity: ${maximumSeverity}`,
                                `Mode: ${previewOnly
                                    ? 'Preview Only'
                                    : 'Apply Changes'
                                }`,
                                '',
                                'Do you want to continue?'
                            ].join('\n'),
                            {
                                modal: true
                            },
                            'Continue'
                        );

                    if (confirmation !== 'Continue') {
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
                    let totalEstimatedLinesChanged = 0;

                    let safeFixes = 0;
                    let reviewFixes = 0;
                    let riskyFixes = 0;

                    let cancelled = false;

                    const totalBreakdown =
                        new Map<string, number>();

                    const totalCategoryBreakdown =
                        new Map<string, number>();

                    const totalSeverityBreakdown =
                        new Map<string, number>();

                    const previewReport: PreviewReport[] = [];

                    await vscode.window.withProgress(
                        {
                            location:
                                vscode.ProgressLocation.Notification,

                            title: previewOnly
                                ? 'CleanCode Deploy Preview'
                                : 'CleanCode Deploy Auto Fix',

                            cancellable: true
                        },
                        async (progress, token) => {

                            let processedFiles = 0;

                            for (const file of files) {

                                if (
                                    token.isCancellationRequested
                                ) {

                                    cancelled = true;

                                    Logger.warning(
                                        'Auto Fix cancelled by user.'
                                    );

                                    StatusBarService.cancelled();

                                    vscode.window.showInformationMessage(
                                        previewOnly
                                            ? 'Auto Fix preview cancelled.'
                                            : 'Auto Fix cancelled.'
                                    );

                                    break;
                                }

                                if (
                                    !FileFilterService.isSupported(
                                        file.fsPath
                                    )
                                ) {
                                    continue;
                                }

                                processedFiles++;

                                progress.report({
                                    message: previewOnly
                                        ? `Previewing file ${processedFiles}...`
                                        : `Fixing file ${processedFiles}...`
                                });

                                const result =
                                    await AutoFixEngine.fixFile(
                                        file
                                    );

                                if (
                                    previewOnly &&
                                    result.appliedFixes > 0
                                ) {

                                    const detectedLanguage =
                                        LanguageDetector.detect(
                                            file.fsPath
                                        );

                                    previewReport.push({
                                        file: result.file,

                                        extension:
                                            path.extname(
                                                file.fsPath
                                            ) ||
                                            'No extension',

                                        language:
                                            detectedLanguage.language,

                                        proposedFixes:
                                            result.appliedFixes,

                                        estimatedLinesChanged:
                                            result.appliedFixes,

                                        rules: Array.from(
                                            result
                                                .fixBreakdown
                                                .entries()
                                        ).map(
                                            ([ruleName, count]) =>
                                                `${ruleName}: ${count}`
                                        ),

                                        categories: Array.from(
                                            result
                                                .categoryBreakdown
                                                .entries()
                                        ).map(
                                            ([category, count]) =>
                                                `${category}: ${count}`
                                        ),

                                        severities: Array.from(
                                            result
                                                .severityBreakdown
                                                .entries()
                                        ).map(
                                            ([severity, count]) =>
                                                `${severity}: ${count}`
                                        )
                                    });
                                }

                                if (result.modified) {
                                    fixedFiles++;
                                }

                                totalFixes +=
                                    result.appliedFixes;

                                totalEstimatedLinesChanged +=
                                    result.appliedFixes;

                                result.fixBreakdown.forEach(
                                    (
                                        count,
                                        fixerName
                                    ) => {

                                        const existingCount =
                                            totalBreakdown.get(
                                                fixerName
                                            ) ?? 0;

                                        totalBreakdown.set(
                                            fixerName,
                                            existingCount + count
                                        );
                                    }
                                );

                                result.categoryBreakdown.forEach(
                                    (
                                        count,
                                        category
                                    ) => {

                                        const existingCount =
                                            totalCategoryBreakdown.get(
                                                category
                                            ) ?? 0;

                                        totalCategoryBreakdown.set(
                                            category,
                                            existingCount + count
                                        );
                                    }
                                );

                                result.severityBreakdown.forEach(
                                    (
                                        count,
                                        severity
                                    ) => {

                                        const existingCount =
                                            totalSeverityBreakdown.get(
                                                severity
                                            ) ?? 0;

                                        totalSeverityBreakdown.set(
                                            severity,
                                            existingCount + count
                                        );

                                        switch (severity) {

                                            case AutoFixSeverity.Safe:
                                                safeFixes += count;
                                                break;

                                            case AutoFixSeverity.Review:
                                                reviewFixes += count;
                                                break;

                                            case AutoFixSeverity.Risky:
                                                riskyFixes += count;
                                                break;
                                        }
                                    }
                                );
                            }
                        }
                    );

                    const overallRiskLevel =
                        riskyFixes > 0
                            ? AutoFixSeverity.Risky
                            : reviewFixes > 0
                                ? AutoFixSeverity.Review
                                : safeFixes > 0
                                    ? AutoFixSeverity.Safe
                                    : 'None';

                    Logger.info(
                        '=============================='
                    );

                    Logger.info(
                        previewOnly
                            ? 'Auto Fix Preview Summary'
                            : 'Auto Fix Summary'
                    );

                    Logger.info(
                        '=============================='
                    );

                    Logger.info(
                        `Auto Fix Profile: ${activeProfile}`
                    );

                    Logger.info(
                        `Maximum Auto Fix Severity: ${maximumSeverity}`
                    );

                    Logger.info(
                        `Mode: ${previewOnly
                            ? 'Preview Only'
                            : 'Apply Changes'
                        }`
                    );

                    if (previewOnly) {

                        Logger.info(
                            `Files With Proposed Changes: ${previewReport.length
                            }`
                        );

                        Logger.info(
                            `Proposed Fixes: ${totalFixes}`
                        );

                        Logger.info(
                            `Estimated Lines Changed: ${totalEstimatedLinesChanged
                            }`
                        );

                        Logger.info(
                            '=============================='
                        );

                        Logger.info(
                            'Preview Risk Summary'
                        );

                        Logger.info(
                            '=============================='
                        );

                        Logger.info(
                            `Safe Fixes: ${safeFixes}`
                        );

                        Logger.info(
                            `Review Fixes: ${reviewFixes}`
                        );

                        Logger.info(
                            `Risky Fixes: ${riskyFixes}`
                        );

                        Logger.info(
                            `Overall Risk Level: ${overallRiskLevel
                            }`
                        );

                    } else {

                        Logger.info(
                            `Files Modified: ${fixedFiles}`
                        );

                        Logger.info(
                            `Fixes Applied: ${totalFixes}`
                        );

                        if (
                            ConfigurationService.isBackupEnabled()
                        ) {

                            Logger.info(
                                `Backup Folder: ` +
                                `${workspaceFolders[0].uri.fsPath}` +
                                '\\.cleancode-backups'
                            );

                        } else {

                            Logger.info(
                                'Backups: Disabled'
                            );
                        }
                    }

                    Logger.info(
                        '=============================='
                    );

                    Logger.info(
                        'Auto Fix Breakdown'
                    );

                    Logger.info(
                        '=============================='
                    );

                    if (totalBreakdown.size === 0) {

                        Logger.info(
                            previewOnly
                                ? 'No proposed fixes were found.'
                                : 'No fixes were applied.'
                        );

                    } else {

                        totalBreakdown.forEach(
                            (
                                count,
                                fixerName
                            ) => {

                                Logger.info(
                                    `${fixerName}: ${count}`
                                );
                            }
                        );
                    }

                    Logger.info(
                        '=============================='
                    );

                    Logger.info(
                        'Category Breakdown'
                    );

                    Logger.info(
                        '=============================='
                    );

                    if (
                        totalCategoryBreakdown.size === 0
                    ) {

                        Logger.info(
                            'No categories recorded.'
                        );

                    } else {

                        totalCategoryBreakdown.forEach(
                            (
                                count,
                                category
                            ) => {

                                Logger.info(
                                    `${category}: ${count}`
                                );
                            }
                        );
                    }

                    Logger.info(
                        '=============================='
                    );

                    Logger.info(
                        'Severity Breakdown'
                    );

                    Logger.info(
                        '=============================='
                    );

                    if (
                        totalSeverityBreakdown.size === 0
                    ) {

                        Logger.info(
                            'No severities recorded.'
                        );

                    } else {

                        totalSeverityBreakdown.forEach(
                            (
                                count,
                                severity
                            ) => {

                                Logger.info(
                                    `${severity}: ${count}`
                                );
                            }
                        );
                    }

                    if (cancelled) {
                        return;
                    }

                    StatusBarService.autoFixCompleted(
                        totalFixes
                    );

                    if (!previewOnly) {

                        await AutoFixStatisticsService.update(
                            fixedFiles,
                            totalFixes
                        );
                    }

                    const action =
                        await vscode.window.showInformationMessage(
                            previewOnly
                                ? [
                                    'Preview completed.',
                                    `Files: ${previewReport.length}`,
                                    `Proposed fixes: ${totalFixes}`,
                                    `Risk: ${overallRiskLevel}`
                                ].join(' ')
                                : [
                                    'Auto Fix completed.',
                                    `Files modified: ${fixedFiles}`,
                                    `Fixes applied: ${totalFixes}`
                                ].join(' '),
                            'Show Details'
                        );

                    if (action === 'Show Details') {

                        const ruleDetails =
                            Array.from(
                                totalBreakdown.entries()
                            )
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
                            `Auto Fix Profile: ${activeProfile}`,

                            `Maximum Severity: ${maximumSeverity
                            }`,

                            `Mode: ${previewOnly
                                ? 'Preview Only'
                                : 'Apply Changes'
                            }`,

                            `Estimated Lines Changed: ${totalEstimatedLinesChanged
                            }`,

                            '',

                            'Risk Summary',
                            '------------',

                            `Safe Fixes: ${safeFixes}`,

                            `Review Fixes: ${reviewFixes
                            }`,

                            `Risky Fixes: ${riskyFixes}`,

                            `Overall Risk Level: ${overallRiskLevel
                            }`,

                            '',

                            'Rule Breakdown',
                            '----------------',

                            ruleDetails ||
                            (
                                previewOnly
                                    ? 'No proposed fixes were found.'
                                    : 'No fixes were applied.'
                            ),

                            '',

                            'Category Breakdown',
                            '------------------',

                            categoryDetails ||
                            'No categories recorded.',

                            '',

                            'Severity Breakdown',
                            '------------------',

                            severityDetails ||
                            'No severities recorded.'
                        ].join('\n');

                        await vscode.window.showInformationMessage(
                            details,
                            {
                                modal: true
                            }
                        );
                    }

                    if (
                        previewOnly &&
                        previewReport.length > 0
                    ) {

                        const previewDetails = [
                            'Preview Report',
                            '==============',

                            '',

                            'Risk Summary',
                            '------------',

                            `Safe Fixes: ${safeFixes}`,

                            `Review Fixes: ${reviewFixes
                            }`,

                            `Risky Fixes: ${riskyFixes}`,

                            `Overall Risk Level: ${overallRiskLevel
                            }`,

                            '',

                            ...previewReport.map(
                                report => [
                                    `File: ${report.file}`,

                                    `Extension: ${report.extension
                                    }`,

                                    `Language: ${report.language
                                    }`,

                                    `Proposed Fixes: ${report.proposedFixes
                                    }`,

                                    `Estimated Lines Changed: ${report
                                        .estimatedLinesChanged
                                    }`,

                                    `Categories: ${report.categories.length > 0
                                        ? report.categories.join(
                                            ', '
                                        )
                                        : 'No categories recorded.'
                                    }`,

                                    `Severities: ${report.severities.length > 0
                                        ? report.severities.join(
                                            ', '
                                        )
                                        : 'No severities recorded.'
                                    }`,

                                    `Rules: ${report.rules.length > 0
                                        ? report.rules.join(
                                            ', '
                                        )
                                        : 'No rules recorded.'
                                    }`,

                                    ''
                                ].join('\n')
                            )
                        ].join('\n');

                        await vscode.window.showInformationMessage(
                            previewDetails,
                            {
                                modal: true
                            }
                        );
                    }

                    if (
                        !previewOnly &&
                        fixedFiles > 0
                    ) {

                        await new Promise<void>(
                            resolve =>
                                setTimeout(
                                    resolve,
                                    3000
                                )
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