export interface ScanStatistics {

    totalFiles: number;

    totalIssues: number;

    warningCount: number;

    infoCount: number;

    errorCount: number;

    issueDensity: number;

    healthScore: number;

    languageCounts: Map<string, number>;

    scanTime: Date;

}