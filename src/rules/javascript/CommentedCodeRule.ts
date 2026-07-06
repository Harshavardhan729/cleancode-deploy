import * as vscode from 'vscode';

import { IRule } from '../interfaces/IRule';
import { Issue } from '../../models/Issue';
import { IssueSeverity } from '../../models/IssueSeverity';
import { RuleMetadata } from '../../models/RuleMetadata';
import { RuleCategory } from '../../models/RuleCategory';

export class CommentedCodeRule implements IRule {

    public readonly id = 'JS006';

    public readonly description =
        'Detect commented-out code';
    
    public get metadata(): RuleMetadata {

        return {

            id: this.id,

            title: this.id,

            description: this.description,

            severity: IssueSeverity.Warning,

            category: RuleCategory.Maintainability,

            autoFixSupported: true,

            enabledByDefault: true

        };

    }

    public async analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]> {

        const issues: Issue[] = [];

        const lines = document.getText().split('\n');

        lines.forEach((line, index) => {

            const trimmed = line.trim();

            if (!trimmed.startsWith('//')) {
                return;
            }

            const comment = trimmed.substring(2).trim();

            const looksLikeCode =
                comment.includes(';') ||
                comment.includes('{') ||
                comment.includes('}') ||
                comment.includes('(') ||
                comment.includes('=') ||
                comment.startsWith('if ') ||
                comment.startsWith('for ') ||
                comment.startsWith('while ') ||
                comment.startsWith('return ') ||
                comment.startsWith('const ') ||
                comment.startsWith('let ') ||
                comment.startsWith('var ') ||
                comment.startsWith('function ');

            if (!looksLikeCode) {
                return;
            }

            issues.push({

                ruleId: this.id,

                message: 'Commented-out code detected',

                severity: IssueSeverity.Warning,

                file: document.fileName,

                line: index + 1,

                column: 1

            });

        });

        return issues;

    }

}