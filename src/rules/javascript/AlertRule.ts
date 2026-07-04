import { TextPatternRule } from '../base/TextPatternRule';

export class AlertRule extends TextPatternRule {

    public readonly id = 'JS003';

    public readonly description =
        'Detect alert() statements';

    protected readonly pattern =
        'alert(';

    protected readonly message =
        'alert() detected';

}