import * as vscode from 'vscode';

export class ConfigurationService {

    private static readonly section =
        'cleancodeDeploy.rules';

    public static isRuleEnabled(
        ruleName: string
    ): boolean {

        return vscode.workspace
            .getConfiguration(this.section)
            .get<boolean>(ruleName, true);

    }

}