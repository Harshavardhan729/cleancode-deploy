import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class PythonTodoFixer implements IAutoFixer {

    public readonly name = 'python TODO';

    public readonly language = 'python';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}