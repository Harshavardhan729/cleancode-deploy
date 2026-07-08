export interface FixResult {

    file: string;

    appliedFixes: number;

    modified: boolean;

    fixBreakdown: Map<string, number>;

}