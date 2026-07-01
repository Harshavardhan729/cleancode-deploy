import * as vscode from 'vscode';
import { Logger } from './utils/Logger';
import { ScanWorkspaceCommand } from './commands/ScanWorkspaceCommand';

export function activate(context: vscode.ExtensionContext) {

	Logger.info('CleanCode Deploy extension activated.');
	Logger.show();

	ScanWorkspaceCommand.register(context);

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