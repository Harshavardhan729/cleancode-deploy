import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class PythonTodoFixer implements IAutoFixer {

    public readonly name = 'python TODO';

    public readonly language = 'python';

    public readonly category =
        AutoFixCategory.Comment;
    
    public readonly severity =
        AutoFixSeverity.Safe;

    public canFix(
        line: string
    ): boolean {

        return line.includes('TODO');

    }

}