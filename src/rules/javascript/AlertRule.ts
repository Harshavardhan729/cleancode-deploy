import { TextPatternRule } from '../base/TextPatternRule';
import { RuleCategory } from '../../models/RuleCategory';

export class AlertRule extends TextPatternRule {

    public readonly id = 'JS003';

    public readonly description =
        'Detect alert() statements';
    
    protected readonly category =
        RuleCategory.Debugging;

    protected readonly pattern =
        'alert(';

    protected readonly message =
        'alert() detected';
    
    public override get metadata() {

        return {

            ...super.metadata,

            title: 'Alert Statement'

        };

    }

}