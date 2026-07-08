import { IAutoFixer } from '../interfaces/IAutoFixer';

export class FixmeFixer implements IAutoFixer {

    public readonly name = 'FIXME';

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}