import * as vscode from 'vscode';

export class ConfigurationService {

    private static readonly rulesSection =
        'cleancodeDeploy.rules';

    private static readonly autoFixSection =
        'cleancodeDeploy.autoFix';

    public static isRuleEnabled(
        ruleName: string
    ): boolean {

        return vscode.workspace
            .getConfiguration(this.rulesSection)
            .get<boolean>(ruleName, true);

    }

    public static isAutoFixEnabled(): boolean {

        return vscode.workspace
            .getConfiguration(this.autoFixSection)
            .get<boolean>('enabled', true);

    }

}