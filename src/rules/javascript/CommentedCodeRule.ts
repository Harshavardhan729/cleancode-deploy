import * as vscode from 'vscode';

import { IRule } from '../interfaces/IRule';
import { Issue } from '../../models/Issue';
import { IssueSeverity } from '../../models/IssueSeverity';

export class CommentedCodeRule implements IRule {

    public readonly id = 'JS006';

    public readonly description =
        'Detect commented-out code';

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