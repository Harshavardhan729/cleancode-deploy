import * as vscode from 'vscode';
import { Issue } from '../../models/Issue';

export interface IRule {

    readonly id: string;

    readonly description: string;

    analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]>;

}