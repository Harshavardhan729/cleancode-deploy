import * as vscode from 'vscode';

import { IRule } from '../interfaces/IRule';
import { Issue } from '../../models/Issue';
import { IssueSeverity } from '../../models/IssueSeverity';

export abstract class TextPatternRule implements IRule {

    public abstract readonly id: string;

    public abstract readonly description: string;

    protected abstract readonly pattern: string;

    protected abstract readonly message: string;

    protected severity: IssueSeverity =
        IssueSeverity.Warning;

    public async analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]> {

        const issues: Issue[] = [];

        const lines = document.getText().split('\n');

        lines.forEach((line, index) => {

            const column = line.indexOf(this.pattern);

            if (column !== -1) {

                issues.push({

                    ruleId: this.id,

                    message: this.message,

                    severity: this.severity,

                    file: document.fileName,

                    line: index + 1,

                    column: column + 1

                });

            }

        });

        return issues;

    }

}