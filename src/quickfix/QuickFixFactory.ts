import * as vscode from 'vscode';

export class QuickFixFactory {

    public static create(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction | undefined {

        switch (diagnostic.code) {

            case 'JS001':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove console.log()'
                );

            case 'JS002':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove debugger'
                );
            
            case 'JS003':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove alert()'
                );
            
            case 'JS004':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove TODO comment'
                );
            
            case 'JS005':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove FIXME comment'
                );
            
            case 'JS006':

                return this.createDeleteLineFix(
                    document,
                    diagnostic,
                    'Remove commented-out code'
                );

            default:

                return undefined;
        }

    }

    private static createDeleteLineFix(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic,
        title: string
    ): vscode.CodeAction {

        const action = new vscode.CodeAction(
            title,
            vscode.CodeActionKind.QuickFix
        );

        action.diagnostics = [diagnostic];

        const edit = new vscode.WorkspaceEdit();

        const line = document.lineAt(
            diagnostic.range.start.line
        );

        edit.delete(
            document.uri,
            line.rangeIncludingLineBreak
        );

        action.edit = edit;

        return action;
    }

}