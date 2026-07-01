import * as vscode from 'vscode';
import { Logger } from '../utils/Logger';

export class WorkspaceScannerService {

    public scan(): void {

        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage(
                'No workspace is currently open.'
            );

            Logger.warning('No workspace found.');

            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;

        Logger.info(`Workspace Path: ${workspacePath}`);

        vscode.window.showInformationMessage(
            `Workspace found:\n${workspacePath}`
        );
    }
}