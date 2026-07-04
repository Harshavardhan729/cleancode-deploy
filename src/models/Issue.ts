import { IssueSeverity } from './IssueSeverity';

export interface Issue {

    ruleId: string;

    message: string;

    severity: IssueSeverity;

    file: string;

    line: number;

    column: number;

}