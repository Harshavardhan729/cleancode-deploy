import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class ConsoleWriteLineFixer implements IAutoFixer {

    public readonly name = 'csharp Console.WriteLine';

    public readonly language = 'csharp';

    public readonly category =
        AutoFixCategory.DebugCode;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('Console.WriteLine(');

    }

}