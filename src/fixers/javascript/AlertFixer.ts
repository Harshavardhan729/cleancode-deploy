import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class AlertFixer implements IAutoFixer {

    public readonly name = 'alert';

    public readonly language = 'javascript';

    public readonly category =
        AutoFixCategory.DebugCode;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.includes('alert(');

    }

}