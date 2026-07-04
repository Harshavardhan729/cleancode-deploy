import * as vscode from 'vscode';

import { IRule } from '../interfaces/IRule';
import { Issue } from '../../models/Issue';

export class RuleEngine {

    public static async execute(

        document: vscode.TextDocument,

        rules: IRule[]

    ): Promise<Issue[]> {

        const issues: Issue[] = [];

        for (const rule of rules) {

            const result = await rule.analyze(document);

            issues.push(...result);

        }

        return issues;

    }

}