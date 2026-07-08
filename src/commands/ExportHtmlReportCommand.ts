import * as vscode from 'vscode';
import { StatisticsService } from '../services/StatisticsService';
import { IssueExplorerService } from '../services/IssueExplorerService';
import { HtmlReportGenerator } from '../services/HtmlReportGenerator';

export class ExportHtmlReportCommand {

    public static readonly commandId =
        'cleancode-deploy.exportHtmlReport';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ExportHtmlReportCommand.commandId,
            async () => {

                const statistics =
                    StatisticsService.get();

                if (!statistics) {

                    vscode.window.showInformationMessage(
                        'No scan data available. Run a workspace scan first.'
                    );

                    return;

                }

                const now = new Date();

                const timestamp =
                    now.getFullYear() +
                    '-' +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    '-' +
                    String(now.getDate()).padStart(2, '0') +
                    '-' +
                    String(now.getHours()).padStart(2, '0') +
                    '-' +
                    String(now.getMinutes()).padStart(2, '0');

                const uri = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(
                        `cleancode-deploy-report-${timestamp}.html`
                    ),
                    filters: {
                        'HTML Files': ['html']
                    }
                });

                if (!uri) {
                    return;
                }

                const html =
                    HtmlReportGenerator.generate({
                        statistics,
                        issues: IssueExplorerService.getIssues(),
                        generatedAt: new Date()
                    });

                await vscode.workspace.fs.writeFile(
                    uri,
                    Buffer.from(html, 'utf8')
                );

                const openReport =
                    await vscode.window.showInformationMessage(
                        'CleanCode Deploy HTML report exported successfully.',
                        'Open'
                    );

                if (openReport === 'Open') {

                    await vscode.commands.executeCommand(
                        'vscode.open',
                        uri
                    );

                }

            }
        );

        context.subscriptions.push(disposable);

    }

}