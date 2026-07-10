import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class SystemOutPrintlnFixer implements IAutoFixer {

    public readonly name = 'java System.out.println';

    public readonly language = 'java';

    public readonly category =
        AutoFixCategory.DebugCode;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('System.out.println(');

    }

}