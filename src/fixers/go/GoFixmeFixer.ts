import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class GoFixmeFixer implements IAutoFixer {

    public readonly name = 'go FIXME';

    public readonly language = 'go';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}