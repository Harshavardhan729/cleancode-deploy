import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class JavaTodoFixer implements IAutoFixer {

    public readonly name = 'java TODO';

    public readonly language = 'java';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}