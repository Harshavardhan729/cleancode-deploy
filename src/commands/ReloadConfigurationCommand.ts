import * as vscode from 'vscode';

export class ReloadConfigurationCommand {

    public static readonly commandId =
        'cleancode-deploy.reloadConfiguration';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ReloadConfigurationCommand.commandId,
            () => {

                vscode.window.showInformationMessage(
                    'CleanCode Deploy configuration reloaded.'
                );

            }
        );

        context.subscriptions.push(disposable);

    }

}