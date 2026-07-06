import { IssueSeverity } from '../../models/IssueSeverity';
import { TextPatternRule } from '../base/TextPatternRule';
import { RuleCategory } from '../../models/RuleCategory';

export class TodoRule extends TextPatternRule {

    public readonly id = 'JS004';

    public readonly description =
        'Detect TODO comments';

    protected readonly pattern =
        'TODO';

    protected readonly message =
        'TODO comment detected';

    protected override severity =
        IssueSeverity.Info;
    
    protected override ignoreCommentLines =
        false;
    
    protected readonly category =
        RuleCategory.Documentation;
    
    public override get metadata() {

        return {

            ...super.metadata,

            title: 'TODO Comment'

        };

    }

}