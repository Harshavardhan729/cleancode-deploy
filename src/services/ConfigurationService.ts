import * as vscode from 'vscode';

export class ConfigurationService {

    private static readonly configuration =
        vscode.workspace.getConfiguration('cleancodeDeploy');

    public static isRuleEnabled(
        ruleName: string
    ): boolean {

        return this.configuration.get<boolean>(
            `rules.${ruleName}`,
            true
        );

    }

}