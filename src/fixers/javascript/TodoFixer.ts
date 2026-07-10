import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';
import { AutoFixSeverity } from '../../models/AutoFixSeverity';

export class TodoFixer implements IAutoFixer {

    public readonly name = 'TODO';

    public readonly language = 'javascript';

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