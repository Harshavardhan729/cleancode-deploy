import * as vscode from 'vscode';
import { AutoFixStatisticsService } from '../services/AutoFixStatisticsService';

export class ShowAutoFixStatisticsCommand {

    public static readonly commandId =
        'cleancode-deploy.showAutoFixStatistics';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable =
            vscode.commands.registerCommand(
                ShowAutoFixStatisticsCommand.commandId,
                () => {

                    const statistics =
                        AutoFixStatisticsService.get();

                    const message = [
                        `Total Runs: ${statistics.totalRuns}`,
                        `Files Modified: ${statistics.totalFilesModified}`,
                        `Fixes Applied: ${statistics.totalFixesApplied}`,
                        `Last Run: ${statistics.lastRun}`
                    ].join('\n');

                    vscode.window.showInformationMessage(
                        message,
                        {
                            modal: true
                        }
                    );

                }
            );

        context.subscriptions.push(disposable);

    }

}