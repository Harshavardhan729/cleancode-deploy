import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class PhpTodoFixer implements IAutoFixer {

    public readonly name = 'php TODO';

    public readonly language = 'php';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}