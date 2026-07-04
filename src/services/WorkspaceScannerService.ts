import * as vscode from 'vscode';
import { Logger } from '../utils/Logger';
import { GlobPatternBuilder } from '../utils/GlobPatternBuilder';
import { LanguageDetector } from './LanguageDetector';
import { ReportGenerator } from './ReportGenerator';
import { ScanReport } from '../models/ScanReport';
import { AnalyzerEngine } from './AnalyzerEngine';
import { DiagnosticService } from './DiagnosticService';
import { FileFilterService } from './FileFilterService';

export class WorkspaceScannerService {

    public async scan(): Promise<void> {

        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {

            vscode.window.showWarningMessage(
                'No workspace is currently open.'
            );

            Logger.warning('No workspace found.');

            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;

        Logger.info(`Workspace Path: ${workspacePath}`);

        Logger.info('Scanning workspace files...');

        const excludePattern = GlobPatternBuilder.buildExcludePattern();

        Logger.info(`Exclude Pattern: ${excludePattern}`);

        const files = await vscode.workspace.findFiles(
            '**/*',
            excludePattern
        );


        Logger.info(`Total Files Found: ${files.length}`);

        const languages = new Map<string, number>();

        for (const file of files) {

            if (!FileFilterService.isSupported(file.fsPath)) {
                Logger.info(`Skipping unsupported file: ${file.fsPath}`);
                continue;
            }

            const language = LanguageDetector.detect(file.fsPath);

            const currentCount = languages.get(language.language) ?? 0;

            languages.set(
                language.language,
                currentCount + 1
            );

            const issues = await AnalyzerEngine.analyze(file);
            DiagnosticService.publish(
                file,
                issues
            );

            issues.forEach(issue => {

                Logger.warning(

                    `[${issue.ruleId}] ${issue.message}
File : ${issue.file}
Line : ${issue.line}
Column : ${issue.column}`

                );

            });

        }

        const report: ScanReport = {

            workspacePath,

            totalFiles: files.length,

            languages

        };

        ReportGenerator.print(report);

        vscode.window.showInformationMessage(
            `Workspace scan completed.\nFiles Found: ${files.length}`
        );
    }
}