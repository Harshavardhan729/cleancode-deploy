import { TextPatternRule } from '../base/TextPatternRule';
import { RuleCategory } from '../../models/RuleCategory';

export class DebuggerRule extends TextPatternRule {

    public readonly id = 'JS002';

    public readonly description =
        'Detect debugger statements';
    
    protected readonly category =
        RuleCategory.Debugging;

    protected readonly pattern =
        'debugger';

    protected readonly message =
        'debugger statement detected';
    
    public override get metadata() {

        return {

            ...super.metadata,

            title: 'Debugger Statement'

        };

    }

}