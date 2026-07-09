import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class CSharpFixmeFixer implements IAutoFixer {

    public readonly name = 'csharp FIXME';

    public readonly language = 'csharp';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('FIXME');

    }

}