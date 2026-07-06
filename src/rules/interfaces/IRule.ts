import * as vscode from 'vscode';
import { Issue } from '../../models/Issue';
import { RuleMetadata } from '../../models/RuleMetadata';

export interface IRule {

    readonly id: string;

    readonly description: string;

    readonly metadata: RuleMetadata;
    analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]>;

}