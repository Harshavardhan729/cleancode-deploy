import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class ConsoleLogFixer implements IAutoFixer {

    public readonly name = 'console.log';

    public readonly language = 'javascript';

    public readonly category =
        AutoFixCategory.DebugCode;

    public canFix(
        line: string
    ): boolean {

        return line.includes('console.log(');

    }

}