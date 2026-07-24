export interface PreviewReport {

    file: string;

    extension: string;

    language: string;

    proposedFixes: number;

    estimatedLinesChanged: number;

    rules: string[];

    categories: string[];

    severities: string[];

}