import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class FmtPrintlnFixer implements IAutoFixer {

    public readonly name = 'go fmt.Println';

    public readonly language = 'go';

    public readonly category =
        AutoFixCategory.DebugCode;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('fmt.Println(');

    }

}