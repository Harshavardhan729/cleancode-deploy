import * as vscode from 'vscode';
import { AutoFixSeverity } from '../models/AutoFixSeverity';

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

    public static isBackupEnabled(): boolean {

        return vscode.workspace
            .getConfiguration('cleancodeDeploy.backup')
            .get<boolean>('enabled', true);

    }

    public static getMaximumAutoFixSeverity(): AutoFixSeverity {

        return vscode.workspace
            .getConfiguration('cleancodeDeploy.autoFix')
            .get<AutoFixSeverity>(
                'maximumSeverity',
                AutoFixSeverity.Safe
            );

    }

}