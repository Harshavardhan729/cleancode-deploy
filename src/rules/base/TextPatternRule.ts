import * as vscode from 'vscode';

import { IRule } from '../interfaces/IRule';
import { Issue } from '../../models/Issue';
import { IssueSeverity } from '../../models/IssueSeverity';
import { RuleMetadata } from '../../models/RuleMetadata';
import { RuleCategory } from '../../models/RuleCategory';

export abstract class TextPatternRule implements IRule {

    public abstract readonly id: string;

    public abstract readonly description: string;

    protected abstract readonly category: RuleCategory;

    protected autoFixSupported = true;

    protected enabledByDefault = true;

    public get metadata(): RuleMetadata {

        return {

            id: this.id,

            title: this.id,

            description: this.description,

            severity: this.severity,

            category: this.category,

            autoFixSupported: this.autoFixSupported,

            enabledByDefault: this.enabledByDefault

        };

    }

    protected abstract readonly pattern: string;

    protected abstract readonly message: string;

    protected severity: IssueSeverity =
        IssueSeverity.Warning;
    
    protected ignoreCommentLines = true;

    public async analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]> {

        const issues: Issue[] = [];

        const lines = document.getText().split('\n');

        lines.forEach((line, index) => {

            const trimmed = line.trim();

            // Ignore comment lines only if the rule wants to
            if (
                this.ignoreCommentLines &&
                trimmed.startsWith('//')
            ) {
                return;
            }

            const column = line.indexOf(this.pattern);

            if (column !== -1) {

                issues.push({

                    ruleId: this.id,

                    message: this.message,

                    severity: this.metadata.severity,
                    
                    file: document.fileName,

                    line: index + 1,

                    column: column + 1

                });

            }

        });

        return issues;

    }

}