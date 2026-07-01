import * as vscode from 'vscode';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';
import { Logger } from '../utils/Logger';

export class ScanWorkspaceCommand {

    public static readonly commandId = 'cleancode-deploy.scanWorkspace';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ScanWorkspaceCommand.commandId,
            () => {

                Logger.info('Starting workspace scan...');

                const scanner = new WorkspaceScannerService();

                scanner.scan();

                Logger.info('Workspace scan completed.');
            }
        );

        context.subscriptions.push(disposable);
    }
}