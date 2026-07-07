import * as vscode from 'vscode';
import { StatisticsService } from '../services/StatisticsService';

export class ShowStatisticsCommand {

    public static readonly commandId =
        'cleancode-deploy.showStatistics';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ShowStatisticsCommand.commandId,
            () => {

                const statistics =
                    StatisticsService.get();

                if (!statistics) {

                    vscode.window.showInformationMessage(
                        'No scan statistics available. Run a workspace scan first.'
                    );

                    return;

                }

                const languageLines =
                    Array.from(statistics.languageCounts.entries()).map(
                        ([language, count]) =>
                            `${language}: ${count}`
                    );
                
                const healthRating =
                    statistics.healthScore >= 90
                        ? 'Excellent'
                        : statistics.healthScore >= 70
                            ? 'Good'
                            : statistics.healthScore >= 50
                                ? 'Needs Attention'
                                : 'Poor';

                const message = [

                    `Files Scanned: ${statistics.totalFiles}`,
                    `Issues Found: ${statistics.totalIssues}`,
                    `Warnings: ${statistics.warningCount}`,
                    `Information: ${statistics.infoCount}`,
                    `Errors: ${statistics.errorCount}`,
                    `Issue Density: ${statistics.issueDensity.toFixed(2)} issues/file`,
                    `Project Health Score: ${statistics.healthScore} / 100 (${healthRating})`,
                    '',
                    'Languages:',
                    ...languageLines,
                    '',
                    `Scan Time: ${statistics.scanTime.toLocaleString()}`

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