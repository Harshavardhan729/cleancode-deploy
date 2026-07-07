import * as vscode from 'vscode';
import { IssueExplorerService } from '../services/IssueExplorerService';

export class ClearIssuesCommand {

    public static readonly commandId =
        'cleancode-deploy.clearIssues';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ClearIssuesCommand.commandId,
            () => {

                IssueExplorerService.clear();

                vscode.window.showInformationMessage(
                    'CleanCode Deploy issues cleared.'
                );

            }
        );

        context.subscriptions.push(disposable);

    }

}