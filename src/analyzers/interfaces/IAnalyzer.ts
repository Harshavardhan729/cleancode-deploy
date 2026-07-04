import * as vscode from 'vscode';
import { Issue } from '../../models/Issue';

export interface IAnalyzer {

    readonly language: string;

    analyze(
        document: vscode.TextDocument
    ): Promise<Issue[]>;

}