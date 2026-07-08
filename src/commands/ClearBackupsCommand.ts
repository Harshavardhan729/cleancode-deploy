import * as vscode from 'vscode';

export class ClearBackupsCommand {

    public static readonly commandId =
        'cleancode-deploy.clearBackups';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable =
            vscode.commands.registerCommand(
                ClearBackupsCommand.commandId,
                async () => {

                    const workspaceFolders =
                        vscode.workspace.workspaceFolders;

                    if (!workspaceFolders ||
                        workspaceFolders.length === 0) {

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

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            'Delete all CleanCode Deploy backup files?',
                            {
                                modal: true
                            },
                            'Delete'
                        );

                    if (confirmation !== 'Delete') {
                        return;
                    }

                    try {

                        await vscode.workspace.fs.delete(
                            backupFolder,
                            {
                                recursive: true,
                                useTrash: true
                            }
                        );

                        vscode.window.showInformationMessage(
                            'CleanCode Deploy backups cleared.'
                        );

                    } catch {

                        vscode.window.showInformationMessage(
                            'No backup folder found.'
                        );

                    }

                }
            );

        context.subscriptions.push(disposable);

    }

}