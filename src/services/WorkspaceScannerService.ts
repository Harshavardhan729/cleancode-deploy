import * as vscode from 'vscode';
import { Logger } from '../utils/Logger';

export class WorkspaceScannerService {

    public async scan(): Promise<void> {

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

        Logger.info('Scanning workspace files...');

        const files = await vscode.workspace.findFiles('**/*');

        Logger.info(`Total Files Found: ${files.length}`);

        for (const file of files) {

            Logger.info(file.fsPath);
        }

        vscode.window.showInformationMessage(
            `Workspace scan completed.\nFiles Found: ${files.length}`
        );
    }
}