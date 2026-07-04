import * as vscode from 'vscode';

import { LanguageDetector } from './LanguageDetector';
import { AnalyzerFactory } from '../analyzers/factory/AnalyzerFactory';
import { Issue } from '../models/Issue';

export class AnalyzerEngine {

    public static async analyze(
        file: vscode.Uri
    ): Promise<Issue[]> {

        const languageInfo = LanguageDetector.detect(file.fsPath);

        const analyzer = AnalyzerFactory.getAnalyzer(
            languageInfo.language
        );

        if (!analyzer) {
            return [];
        }

        try {

            const document = await vscode.workspace.openTextDocument(file);

            return await analyzer.analyze(document);

        } catch (error) {

            console.warn(
                `Unable to analyze file: ${file.fsPath}`,
                error
            );

            return [];

        }

    }

}