import * as vscode from 'vscode';
import { StatisticsService } from '../services/StatisticsService';
import { IssueExplorerService } from '../services/IssueExplorerService';
import { HtmlReportGenerator } from '../services/HtmlReportGenerator';

export class PreviewHtmlReportCommand {

    public static readonly commandId =
        'cleancode-deploy.previewHtmlReport';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            PreviewHtmlReportCommand.commandId,
            () => {

                const statistics =
                    StatisticsService.get();

                if (!statistics) {

                    vscode.window.showInformationMessage(
                        'No scan data available. Run a workspace scan first.'
                    );

                    return;

                }

                const issues =
                    IssueExplorerService.getIssues();

                const html =
                    HtmlReportGenerator.generate({
                        statistics,
                        issues,
                        generatedAt: new Date()
                    });

                const panel =
                    vscode.window.createWebviewPanel(
                        'cleancodeDeployReport',
                        'CleanCode Deploy Report',
                        vscode.ViewColumn.One,
                        {}
                    );

                panel.webview.html = html;

            }
        );

        context.subscriptions.push(disposable);

    }

}