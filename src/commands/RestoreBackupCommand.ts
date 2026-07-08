import * as vscode from 'vscode';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';

export class RestoreBackupCommand {

    public static readonly commandId =
        'cleancode-deploy.restoreBackup';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable =
            vscode.commands.registerCommand(
                RestoreBackupCommand.commandId,
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

                    const workspaceRoot =
                        workspaceFolders[0].uri;

                    const backupFolder =
                        vscode.Uri.joinPath(
                            workspaceRoot,
                            '.cleancode-backups'
                        );

                    let backups: [string, vscode.FileType][] = [];

                    try {

                        backups =
                            await vscode.workspace.fs.readDirectory(
                                backupFolder
                            );

                    } catch {

                        vscode.window.showInformationMessage(
                            'No backup folder found.'
                        );

                        return;

                    }

                    const backupFiles =
                        backups
                            .filter(([name, type]) =>
                                type === vscode.FileType.File &&
                                name.endsWith('.cleancode-backup')
                            )
                            .map(([name]) => name);

                    if (backupFiles.length === 0) {

                        vscode.window.showInformationMessage(
                            'No backup files found.'
                        );

                        return;

                    }

                    const selectedBackup =
                        await vscode.window.showQuickPick(
                            backupFiles,
                            {
                                placeHolder:
                                    'Select a backup file to restore'
                            }
                        );

                    if (!selectedBackup) {
                        return;
                    }

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            `Restore ${selectedBackup}? This will overwrite the current file.`,
                            {
                                modal: true
                            },
                            'Restore'
                        );

                    if (confirmation !== 'Restore') {
                        return;
                    }

                    const backupUri =
                        vscode.Uri.joinPath(
                            backupFolder,
                            selectedBackup
                        );

                    const originalFileName =
                        selectedBackup.replace(
                            '.cleancode-backup',
                            ''
                        );

                    const originalUri =
                        vscode.Uri.joinPath(
                            workspaceRoot,
                            originalFileName
                        );

                    const backupContent =
                        await vscode.workspace.fs.readFile(
                            backupUri
                        );

                    await vscode.workspace.fs.writeFile(
                        originalUri,
                        backupContent
                    );

                    vscode.window.showInformationMessage(
                        `Backup restored: ${originalFileName}`
                    );

                    const scanner =
                        new WorkspaceScannerService();

                    await scanner.scan();

                }
            );

        context.subscriptions.push(disposable);

    }

}