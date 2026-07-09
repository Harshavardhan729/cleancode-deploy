import { AutoFixCategory } from './AutoFixCategory';

export interface FixResult {

    file: string;

    appliedFixes: number;

    modified: boolean;

    fixBreakdown: Map<string, number>;

    categoryBreakdown: Map<AutoFixCategory, number>;

}