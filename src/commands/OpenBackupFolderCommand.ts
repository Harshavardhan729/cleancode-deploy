import * as vscode from 'vscode';

export class OpenBackupFolderCommand {

    public static readonly commandId =
        'cleancode-deploy.openBackupFolder';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            OpenBackupFolderCommand.commandId,
            async () => {

                const workspaceFolders =
                    vscode.workspace.workspaceFolders;

                if (!workspaceFolders || workspaceFolders.length === 0) {

                    vscode.window.showWarningMessage(
                        'No workspace is currently open.'
                    );

                    return;

                }

                const backupFolder =
                    vscode.Uri.joinPath(
                        workspaceFolders[0].uri,
                        '.cleancode-backups'
                    );

                await vscode.commands.executeCommand(
                    'revealFileInOS',
                    backupFolder
                );

            }
        );

        context.subscriptions.push(disposable);

    }

}