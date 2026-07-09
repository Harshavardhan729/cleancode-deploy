import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class FixmeFixer implements IAutoFixer {

    public readonly name = 'FIXME';

    public readonly language = 'javascript';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}