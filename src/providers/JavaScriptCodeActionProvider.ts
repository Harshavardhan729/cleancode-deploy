import * as vscode from 'vscode';
import { QuickFixFactory } from '../quickfix/QuickFixFactory';

export class JavaScriptCodeActionProvider
    implements vscode.CodeActionProvider {

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {

        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {

            if (!diagnostic.range.intersection(range)) {
                continue;
            }

            const action = QuickFixFactory.create(
                document,
                diagnostic
            );

            if (action) {
                actions.push(action);
            }

        }
        return actions;
    }
}