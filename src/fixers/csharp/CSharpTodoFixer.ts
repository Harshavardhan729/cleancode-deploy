import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class CSharpTodoFixer implements IAutoFixer {

    public readonly name = 'csharp TODO';

    public readonly language = 'csharp';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}