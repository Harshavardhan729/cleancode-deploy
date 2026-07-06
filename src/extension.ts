import * as vscode from 'vscode';
import { Logger } from './utils/Logger';
import { ScanWorkspaceCommand } from './commands/ScanWorkspaceCommand';
import { StatusBarService } from './services/StatusBarService';
import { JavaScriptCodeActionProvider } from './providers/JavaScriptCodeActionProvider';
import { ListRulesCommand } from './commands/ListRulesCommand';
import { IssueTreeDataProvider } from './views/IssueTreeDataProvider';
import { IssueExplorerService } from './services/IssueExplorerService';
import { OpenIssueCommand } from './commands/OpenIssueCommand';

export function activate(context: vscode.ExtensionContext) {

	Logger.info('CleanCode Deploy extension activated.');
	Logger.show();

	StatusBarService.initialize();

	const issueProvider = new IssueTreeDataProvider();

	IssueExplorerService.register(issueProvider);

	context.subscriptions.push(
		vscode.window.createTreeView(
			'cleancodeDeploy.issueExplorer',
			{
				treeDataProvider: issueProvider
			}
		)
	);
	
	ScanWorkspaceCommand.register(context);
	ListRulesCommand.register(context);
	OpenIssueCommand.register(context);
	
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

	context.subscriptions.push(disposable);
}

export function deactivate() { }