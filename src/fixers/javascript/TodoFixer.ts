import { IAutoFixer } from '../interfaces/IAutoFixer';

export class TodoFixer implements IAutoFixer {

    public readonly name = 'TODO';

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}