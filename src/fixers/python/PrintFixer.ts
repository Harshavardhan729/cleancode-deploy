import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class PrintFixer implements IAutoFixer {

    public readonly name = 'python print';

    public readonly language = 'python';

    public readonly category =
        AutoFixCategory.DebugCode;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('print(');

    }

}