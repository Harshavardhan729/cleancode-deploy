import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class GoTodoFixer implements IAutoFixer {

    public readonly name = 'go TODO';

    public readonly language = 'go';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}