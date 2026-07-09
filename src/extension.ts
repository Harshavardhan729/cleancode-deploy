import * as vscode from 'vscode';
import { Logger } from './utils/Logger';
import { ScanWorkspaceCommand } from './commands/ScanWorkspaceCommand';
import { StatusBarService } from './services/StatusBarService';
import { JavaScriptCodeActionProvider } from './providers/JavaScriptCodeActionProvider';
import { ListRulesCommand } from './commands/ListRulesCommand';
import { IssueTreeDataProvider } from './views/IssueTreeDataProvider';
import { IssueExplorerService } from './services/IssueExplorerService';
import { OpenIssueCommand } from './commands/OpenIssueCommand';
import { ClearIssuesCommand } from './commands/ClearIssuesCommand';
import { ReloadConfigurationCommand } from './commands/ReloadConfigurationCommand';
import { ShowStatisticsCommand } from './commands/ShowStatisticsCommand';
import { PreviewHtmlReportCommand } from './commands/PreviewHtmlReportCommand';
import { ExportHtmlReportCommand } from './commands/ExportHtmlReportCommand';
import { AutoFixWorkspaceCommand } from './commands/AutoFixWorkspaceCommand';
import { OpenBackupFolderCommand } from './commands/OpenBackupFolderCommand';
import { RestoreBackupCommand } from './commands/RestoreBackupCommand';
import { ClearBackupsCommand } from './commands/ClearBackupsCommand';
import { ShowAutoFixStatisticsCommand } from './commands/ShowAutoFixStatisticsCommand';
import { AutoFixStatisticsService } from './services/AutoFixStatisticsService';

export function activate(context: vscode.ExtensionContext) {

	Logger.info('CleanCode Deploy extension activated.');
	Logger.show();

	StatusBarService.initialize();

	AutoFixStatisticsService.initialize(context);

	const issueProvider = new IssueTreeDataProvider();

	const issueTreeView =
		vscode.window.createTreeView(
			'cleancodeDeploy.issueExplorer',
			{
				treeDataProvider: issueProvider
			}
		);

	IssueExplorerService.register(
		issueProvider,
		issueTreeView
	);

	context.subscriptions.push(issueTreeView);

	ScanWorkspaceCommand.register(context);
	ListRulesCommand.register(context);
	OpenIssueCommand.register(context);
	ClearIssuesCommand.register(context);
	ReloadConfigurationCommand.register(context);
	ShowStatisticsCommand.register(context);
	PreviewHtmlReportCommand.register(context);
	ExportHtmlReportCommand.register(context);
	AutoFixWorkspaceCommand.register(context);
	OpenBackupFolderCommand.register(context);
	RestoreBackupCommand.register(context);
	ClearBackupsCommand.register(context);
	ShowAutoFixStatisticsCommand.register(context);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'javascript',
			new JavaScriptCodeActionProvider()
		)
	);

	const disposable = vscode.commands.registerCommand(
		'cleancode-deploy.helloWorld',
		() => {

			Logger.info('Hello World command executed.');

			vscode.window.showInformationMessage(
				'Hello from CleanCode Deploy 🚀'
			);

		}
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(event => {

			if (
				event.affectsConfiguration(
					'cleancodeDeploy.rules'
				)
			) {

				vscode.window.showInformationMessage(
					'CleanCode Deploy configuration updated.'
				);

			}

		})
	);

	context.subscriptions.push(disposable);

}

export function deactivate() { }