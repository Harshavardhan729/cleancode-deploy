import * as vscode from 'vscode';
import { FixResult } from '../models/FixResult';
import { AutoFixFactory } from '../fixers/AutoFixFactory';
import { LanguageDetector } from './LanguageDetector';
import { ConfigurationService } from './ConfigurationService';
import { AutoFixCategory } from '../models/AutoFixCategory';
import { AutoFixSeverity } from '../models/AutoFixSeverity';
import { Logger } from '../utils/Logger';

export class AutoFixEngine {

    public static async fixFile(
        file: vscode.Uri
    ): Promise<FixResult> {

        const document =
            await vscode.workspace.openTextDocument(file);

        const originalText =
            document.getText();

        const lines =
            originalText.split(/\r?\n/);

        const detectedLanguage =
            LanguageDetector.detect(file.fsPath);

        const availableFixers =
            AutoFixFactory.getFixers(
                detectedLanguage.language
            );

        const maximumSeverity =
            ConfigurationService.getProfileSeverity();

        const severityOrder: Record<AutoFixSeverity, number> = {
            [AutoFixSeverity.Safe]: 1,
            [AutoFixSeverity.Review]: 2,
            [AutoFixSeverity.Risky]: 3
        };

        const fixers =
            availableFixers.filter(
                fixer =>
                    severityOrder[fixer.severity] <=
                    severityOrder[maximumSeverity]
            );

        const fixBreakdown =
            new Map<string, number>();

        const categoryBreakdown =
            new Map<AutoFixCategory, number>();

        const severityBreakdown =
            new Map<AutoFixSeverity, number>();

        const filteredLines =
            lines.filter(line => {

                const fixer =
                    fixers.find(currentFixer =>
                        currentFixer.canFix(line)
                    );

                if (!fixer) {
                    return true;
                }

                fixBreakdown.set(
                    fixer.name,
                    (fixBreakdown.get(fixer.name) ?? 0) + 1
                );

                categoryBreakdown.set(
                    fixer.category,
                    (categoryBreakdown.get(fixer.category) ?? 0) + 1
                );

                severityBreakdown.set(
                    fixer.severity,
                    (severityBreakdown.get(fixer.severity) ?? 0) + 1
                );

                return false;

            });

        const appliedFixes =
            lines.length - filteredLines.length;

        if (appliedFixes === 0) {

            return {
                file: file.fsPath,
                appliedFixes: 0,
                modified: false,
                fixBreakdown,
                categoryBreakdown,
                severityBreakdown
            };

        }

        const updatedText =
            filteredLines.join('\n');

        const previewOnly =
            ConfigurationService.isAutoFixPreviewOnly();

        if (previewOnly) {

            Logger.info(
                `Preview Only: ${file.fsPath}`
            );

            return {
                file: file.fsPath,
                appliedFixes,
                modified: false,
                fixBreakdown,
                categoryBreakdown,
                severityBreakdown
            };

        }

        if (ConfigurationService.isBackupEnabled()) {

            const workspaceFolder =
                vscode.workspace.getWorkspaceFolder(file);

            const backupRoot =
                workspaceFolder
                    ? vscode.Uri.joinPath(
                        workspaceFolder.uri,
                        '.cleancode-backups'
                    )
                    : vscode.Uri.file(
                        `${file.fsPath}.cleancode-backups`
                    );

            await vscode.workspace.fs.createDirectory(
                backupRoot
            );

            const fileName =
                file.fsPath.split(/[\\/]/).pop();

            if (!fileName) {

                throw new Error(
                    `Unable to determine file name: ${file.fsPath}`
                );

            }

            const backupUri =
                vscode.Uri.joinPath(
                    backupRoot,
                    `${fileName}.cleancode-backup`
                );

            await vscode.workspace.fs.writeFile(
                backupUri,
                Buffer.from(originalText, 'utf8')
            );

        }

        await vscode.workspace.fs.writeFile(
            file,
            Buffer.from(updatedText, 'utf8')
        );

        return {
            file: file.fsPath,
            appliedFixes,
            modified: true,
            fixBreakdown,
            categoryBreakdown,
            severityBreakdown
        };

    }

}