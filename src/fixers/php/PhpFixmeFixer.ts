import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class PhpFixmeFixer implements IAutoFixer {

    public readonly name = 'php FIXME';

    public readonly language = 'php';

    public readonly category =
        AutoFixCategory.Comment;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}