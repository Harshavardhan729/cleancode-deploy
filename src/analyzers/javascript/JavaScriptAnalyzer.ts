import * as vscode from 'vscode';

import { IAnalyzer } from '../interfaces/IAnalyzer';
import { Issue } from '../../models/Issue';
import { RuleEngine } from '../../rules/engine/RuleEngine';
import { JavaScriptRuleRegistry } from '../../rules/registry/JavaScriptRuleRegistry';

export class JavaScriptAnalyzer implements IAnalyzer {

    public readonly language = 'JavaScript';

    public async analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]> {

        const rules = JavaScriptRuleRegistry.getRules();

        return RuleEngine.execute(
            document,
            rules
        );

    }

}