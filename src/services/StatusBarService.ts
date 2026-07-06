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

    public static cancelled(): void {

        this.statusBar.text =
            '$(circle-slash) Scan Cancelled';

    }

}