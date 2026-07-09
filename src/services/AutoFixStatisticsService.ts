import * as vscode from 'vscode';
import { AutoFixStatistics } from '../models/AutoFixStatistics';

export class AutoFixStatisticsService {

    private static readonly storageKey =
        'cleancodeDeploy.autoFixStatistics';

    private static context: vscode.ExtensionContext;

    private static statistics: AutoFixStatistics = {
        totalRuns: 0,
        totalFilesModified: 0,
        totalFixesApplied: 0,
        lastRun: 'Never'
    };

    public static initialize(
        context: vscode.ExtensionContext
    ): void {

        this.context = context;

        const saved =
            context.globalState.get<AutoFixStatistics>(
                this.storageKey
            );

        if (saved) {
            this.statistics = saved;
        }

    }

    public static async update(
        filesModified: number,
        fixesApplied: number
    ): Promise<void> {

        this.statistics.totalRuns++;

        this.statistics.totalFilesModified +=
            filesModified;

        this.statistics.totalFixesApplied +=
            fixesApplied;

        this.statistics.lastRun =
            new Date().toLocaleString();

        await this.context.globalState.update(
            this.storageKey,
            this.statistics
        );

    }

    public static get(): AutoFixStatistics {

        return this.statistics;

    }

    public static async clear(): Promise<void> {

        this.statistics = {
            totalRuns: 0,
            totalFilesModified: 0,
            totalFixesApplied: 0,
            lastRun: 'Never'
        };

        await this.context.globalState.update(
            this.storageKey,
            this.statistics
        );

    }

}