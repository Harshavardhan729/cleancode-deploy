import * as vscode from 'vscode';
import { WorkspaceScannerService } from '../services/WorkspaceScannerService';
import { Logger } from '../utils/Logger';
import { StatusBarService } from '../services/StatusBarService';
import { RuleCatalogService } from '../services/RuleCatalogService';

export class ScanWorkspaceCommand {

    public static readonly commandId = 'cleancode-deploy.scanWorkspace';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ScanWorkspaceCommand.commandId,
            async () => {

                const metadata = RuleCatalogService.getAllMetadata();

                Logger.info('==============================');
                Logger.info('Registered Rules');
                Logger.info('==============================');

                for (const rule of metadata) {

                    Logger.info(
                        `${rule.id} | ${rule.category} | ${rule.severity} | ${rule.title}`
                    );

                }

                Logger.info('Starting workspace scan...');
                StatusBarService.scanning();
                const scanner = new WorkspaceScannerService();

                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: 'CleanCode Deploy',
                        cancellable: true
                    },
                    async (progress, token) => {

                        progress.report({
                            message: 'Scanning workspace...'
                        });

                        const completed = await scanner.scan(token);

                        if (completed) {
                            StatusBarService.completed();
                            Logger.info('Workspace scan completed.');

                            progress.report({
                                message: 'Scan completed.'
                            });

                        }

                    }
                );

            }
        );
        context.subscriptions.push(disposable);
    }
}