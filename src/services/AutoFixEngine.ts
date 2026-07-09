import * as vscode from 'vscode';
import { FixResult } from '../models/FixResult';
import { AutoFixFactory } from '../fixers/AutoFixFactory';
import { LanguageDetector } from './LanguageDetector';
import { ConfigurationService } from './ConfigurationService';
import { AutoFixCategory } from '../models/AutoFixCategory';

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

        const fixers =
            AutoFixFactory.getFixers(
                detectedLanguage.language
            );

        const fixBreakdown =
            new Map<string, number>();

        const categoryBreakdown =
            new Map<AutoFixCategory, number>();

        const filteredLines =
            lines.filter(line => {

                const fixer =
                    fixers.find(f =>
                        f.canFix(line)
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
                categoryBreakdown
            };

        }

        const updatedText =
            filteredLines.join('\n');

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

            const backupUri =
                vscode.Uri.joinPath(
                    backupRoot,
                    `${file.fsPath.split(/[\\/]/).pop()}.cleancode-backup`
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
            categoryBreakdown
        };

    }

}