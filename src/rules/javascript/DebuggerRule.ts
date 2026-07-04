import { TextPatternRule } from '../base/TextPatternRule';

export class DebuggerRule extends TextPatternRule {

    public readonly id = 'JS002';

    public readonly description =
        'Detect debugger statements';

    protected readonly pattern =
        'debugger';

    protected readonly message =
        'debugger statement detected';

}