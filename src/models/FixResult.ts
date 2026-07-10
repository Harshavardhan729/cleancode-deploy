import { AutoFixCategory } from './AutoFixCategory';
import { AutoFixSeverity } from './AutoFixSeverity';

export interface FixResult {

    file: string;

    appliedFixes: number;

    modified: boolean;

    fixBreakdown: Map<string, number>;

    categoryBreakdown: Map<AutoFixCategory, number>;

    severityBreakdown: Map<AutoFixSeverity, number>;

}