import { IAutoFixer } from '../interfaces/IAutoFixer';

export class ConsoleLogFixer implements IAutoFixer {

    public readonly name = 'console.log';

    public canFix(
        line: string
    ): boolean {

        return line.includes('console.log(');

    }

}