export interface IAutoFixer {

    readonly name: string;

    canFix(
        line: string
    ): boolean;

}