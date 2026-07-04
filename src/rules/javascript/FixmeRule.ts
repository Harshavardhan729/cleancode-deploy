import { IssueSeverity } from '../../models/IssueSeverity';
import { TextPatternRule } from '../base/TextPatternRule';

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

}