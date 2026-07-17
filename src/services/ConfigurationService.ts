import * as vscode from 'vscode';
import { AutoFixSeverity } from '../models/AutoFixSeverity';
import { AutoFixProfile } from '../models/AutoFixProfile';

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



    public static getAutoFixProfile(): AutoFixProfile {

        return vscode.workspace
            .getConfiguration('cleancodeDeploy.autoFix')
            .get<AutoFixProfile>(
                'profile',
                AutoFixProfile.Conservative
            );

    }

    public static getProfileSeverity(): AutoFixSeverity {

        const profile =
            this.getAutoFixProfile();

        switch (profile) {

            case AutoFixProfile.Balanced:
                return AutoFixSeverity.Review;

            case AutoFixProfile.Aggressive:
                return AutoFixSeverity.Risky;

            case AutoFixProfile.Conservative:
            default:
                return AutoFixSeverity.Safe;

        }

    }

    public static isAutoFixPreviewOnly(): boolean {

        return vscode.workspace
            .getConfiguration('cleancodeDeploy.autoFix')
            .get<boolean>('previewOnly', false);

    }

}