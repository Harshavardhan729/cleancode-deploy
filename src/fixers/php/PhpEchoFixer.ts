import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class PhpEchoFixer implements IAutoFixer {

    public readonly name = 'php echo';

    public readonly language = 'php';

    public readonly category =
        AutoFixCategory.DebugCode;

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('echo ');

    }

}