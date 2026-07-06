import { TextPatternRule } from '../base/TextPatternRule';
import { RuleCategory } from '../../models/RuleCategory';

export class ConsoleLogRule extends TextPatternRule {

    public readonly id = 'JS001';

    public readonly description =
        'Detect console.log statements';

    public override get metadata() {

        return {

            ...super.metadata,

            title: 'Console Log'

        };

    }
    
    protected readonly category =
        RuleCategory.Debugging;

    protected readonly pattern =
        'console.log(';

    protected readonly message =
        'console.log detected';
}