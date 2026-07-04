import { TextPatternRule } from '../base/TextPatternRule';

export class ConsoleLogRule extends TextPatternRule {

    public readonly id = 'JS001';

    public readonly description =
        'Detect console.log statements';

    protected readonly pattern =
        'console.log(';

    protected readonly message =
        'console.log detected';
}