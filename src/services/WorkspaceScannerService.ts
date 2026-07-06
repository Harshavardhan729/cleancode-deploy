import * as vscode from 'vscode';
import { Logger } from '../utils/Logger';
import { GlobPatternBuilder } from '../utils/GlobPatternBuilder';
import { LanguageDetector } from './LanguageDetector';
import { ReportGenerator } from './ReportGenerator';
import { ScanReport } from '../models/ScanReport';
import { AnalyzerEngine } from './AnalyzerEngine';
import { DiagnosticService } from './DiagnosticService';
import { FileFilterService } from './FileFilterService';
import { StatusBarService } from './StatusBarService';
import { IssueExplorerService } from './IssueExplorerService';
import { IssueExplorerItem } from '../models/IssueExplorerItem';

export class WorkspaceScannerService {

    public async scan(
        token?: vscode.CancellationToken
    ): Promise<boolean> {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {

            vscode.window.showWarningMessage(
                'No workspace is currently open.'
            );

            Logger.warning('No workspace found.');

            return false;
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
        const issueMap = new Map<string, IssueExplorerItem[]>();
        
        for (const file of files) {
            if (token?.isCancellationRequested) {
                StatusBarService.cancelled();

                Logger.warning('Workspace scan cancelled.');

                vscode.window.showInformationMessage(
                    'Workspace scan cancelled.'
                );

                return false;

            }

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

                const fileIssues =
                    issueMap.get(issue.file) ?? [];

                fileIssues.push({
                    type: 'issue',
                    label: `${issue.ruleId} - ${issue.message} (Line ${issue.line})`,
                    file: issue.file,
                    line: issue.line,
                    column: issue.column
                });

                issueMap.set(
                    issue.file,
                    fileIssues
                );

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

        // Update the Issue Explorer
        const explorerItems: IssueExplorerItem[] =
            Array.from(issueMap.entries()).map(
                ([file, children]) => ({
                    type: 'file',
                    label: file,
                    file,
                    children
                })
            );
        
        IssueExplorerService.update(explorerItems);

        vscode.window.showInformationMessage(
            `Workspace scan completed.\nFiles Found: ${files.length}`
        );

        Logger.info('==============================');
        Logger.info('Issues collected');
        Logger.info('==============================');
        
        return true;
    }
}