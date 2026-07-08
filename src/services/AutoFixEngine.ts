import * as vscode from 'vscode';
import { FixResult } from '../models/FixResult';
import { AutoFixRegistry } from '../fixers/AutoFixRegistry';

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

        const fixers =
            AutoFixRegistry.getFixers();

        const fixBreakdown =
            new Map<string, number>();

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

                return false;

            });

        const appliedFixes =
            lines.length - filteredLines.length;

        if (appliedFixes === 0) {

            return {
                file: file.fsPath,
                appliedFixes: 0,
                modified: false,
                fixBreakdown
            };

        }

        const updatedText =
            filteredLines.join('\n');

        const backupUri =
            vscode.Uri.file(
                `${file.fsPath}.cleancode-backup`
            );

        await vscode.workspace.fs.writeFile(
            backupUri,
            Buffer.from(originalText, 'utf8')
        );

        await vscode.workspace.fs.writeFile(
            file,
            Buffer.from(updatedText, 'utf8')
        );

        return {
            file: file.fsPath,
            appliedFixes,
            modified: true,
            fixBreakdown
        };

    }

}