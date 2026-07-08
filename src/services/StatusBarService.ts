import * as vscode from 'vscode';

export class StatusBarService {

    private static readonly statusBar =
        vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );

    public static initialize(): void {

        this.statusBar.text =
            '$(check) CleanCode Ready';

        this.statusBar.tooltip =
            'CleanCode Deploy';

        this.statusBar.show();

    }

    public static scanning(): void {

        this.statusBar.text =
            '$(sync~spin) Scanning Workspace...';

    }

    public static completed(): void {

        this.statusBar.text =
            '$(check) Scan Complete';

    }

    public static healthScore(
        score: number
    ): void {

        let icon = '$(error)';

        if (score >= 90) {

            icon = '$(pass)';

        } else if (score >= 70) {

            icon = '$(warning)';

        }

        this.statusBar.text =
            `${icon} CleanCode: ${score}/100`;

        this.statusBar.tooltip =
            `Project Health Score: ${score}/100`;

    }

    public static autoFixCompleted(
        fixes: number
    ): void {

        this.statusBar.text =
            `$(tools) CleanCode Fixes: ${fixes}`;

        this.statusBar.tooltip =
            `Auto Fix completed. Fixes applied: ${fixes}`;

        this.statusBar.show();

    }

    public static cancelled(): void {

        this.statusBar.text =
            '$(circle-slash) Scan Cancelled';

    }

}