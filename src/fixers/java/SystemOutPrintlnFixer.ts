import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class SystemOutPrintlnFixer implements IAutoFixer {

    public readonly name = 'java System.out.println';

    public readonly language = 'java';

    public readonly category =
        AutoFixCategory.DebugCode;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('System.out.println(');

    }

}