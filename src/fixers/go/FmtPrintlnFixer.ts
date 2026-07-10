import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class FmtPrintlnFixer implements IAutoFixer {

    public readonly name = 'go fmt.Println';

    public readonly language = 'go';

    public readonly category =
        AutoFixCategory.DebugCode;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('fmt.Println(');

    }

}