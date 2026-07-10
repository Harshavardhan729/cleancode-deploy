import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class JavaTodoFixer implements IAutoFixer {

    public readonly name = 'java TODO';

    public readonly language = 'java';

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