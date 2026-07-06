import { IssueSeverity } from '../../models/IssueSeverity';
import { TextPatternRule } from '../base/TextPatternRule';
import { RuleCategory } from '../../models/RuleCategory';

export class FixmeRule extends TextPatternRule {

    public readonly id = 'JS005';

    public readonly description =
        'Detect FIXME comments';

    protected readonly pattern =
        'FIXME';

    protected readonly message =
        'FIXME comment detected';

    protected override severity =
        IssueSeverity.Warning;
    
    protected override ignoreCommentLines =
        false;
    
    protected readonly category =
        RuleCategory.Documentation;
    
    public override get metadata() {

        return {

            ...super.metadata,

            title: 'FIXME Comment'

        };

    }

}