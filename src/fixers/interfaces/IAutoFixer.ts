import { AutoFixCategory } from '../../models/AutoFixCategory';

export interface IAutoFixer {

    readonly name: string;

    readonly language: string;

    readonly category: AutoFixCategory;

    canFix(
        line: string
    ): boolean;

}