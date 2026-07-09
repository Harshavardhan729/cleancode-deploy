import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class JavaFixmeFixer implements IAutoFixer {

    public readonly name = 'java FIXME';

    public readonly language = 'java';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}