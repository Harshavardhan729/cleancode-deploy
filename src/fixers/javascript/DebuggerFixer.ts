import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class DebuggerFixer implements IAutoFixer {

    public readonly name = 'debugger';

    public readonly language = 'javascript';

    public readonly category =
        AutoFixCategory.DebugCode;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('debugger');

    }

}