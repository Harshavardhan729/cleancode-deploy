import * as vscode from 'vscode';
import { IssueExplorerItem } from '../models/IssueExplorerItem';

export class OpenIssueCommand {

    public static readonly commandId =
        'cleancode-deploy.openIssue';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            OpenIssueCommand.commandId,
            async (item: IssueExplorerItem) => {

                if (!item.file || !item.line) {
                    return;
                }

                const document =
                    await vscode.workspace.openTextDocument(item.file);

                const editor =
                    await vscode.window.showTextDocument(document);

                const position = new vscode.Position(
                    item.line - 1,
                    Math.max((item.column ?? 1) - 1, 0)
                );

                editor.selection = new vscode.Selection(
                    position,
                    position
                );

                editor.revealRange(
                    new vscode.Range(position, position),
                    vscode.TextEditorRevealType.InCenter
                );

            }
        );

        context.subscriptions.push(disposable);

    }

}