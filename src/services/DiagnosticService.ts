import * as vscode from 'vscode';
import { Issue } from '../models/Issue';
import { IssueSeverity } from '../models/IssueSeverity';

export class DiagnosticService {

    private static readonly collection =
        vscode.languages.createDiagnosticCollection(
            'CleanCode Deploy'
        );

    public static publish(
        file: vscode.Uri,
        issues: Issue[]
    ): void {

        const diagnostics: vscode.Diagnostic[] = [];

        for (const issue of issues) {

            const range = new vscode.Range(

                issue.line - 1,
                issue.column - 1,

                issue.line - 1,
                issue.column + 10

            );

            const diagnostic = new vscode.Diagnostic(

                range,

                issue.message,

                this.convertSeverity(issue.severity)

            );

            diagnostic.code = issue.ruleId;

            diagnostics.push(diagnostic);

        }

        this.collection.set(file, diagnostics);

    }

    private static convertSeverity(

        severity: IssueSeverity

    ): vscode.DiagnosticSeverity {

        switch (severity) {

            case IssueSeverity.Error:

                return vscode.DiagnosticSeverity.Error;

            case IssueSeverity.Warning:

                return vscode.DiagnosticSeverity.Warning;

            default:

                return vscode.DiagnosticSeverity.Information;

        }

    }

}