import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export interface IAutoFixer {

    readonly name: string;

    readonly language: string;

    readonly category: AutoFixCategory;

    readonly severity: AutoFixSeverity;

    canFix(
        line: string
    ): boolean;

}