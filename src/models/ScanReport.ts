export interface ScanReport {

    workspacePath: string;

    totalFiles: number;

    languages: Map<string, number>;

}