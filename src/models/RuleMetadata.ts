import { IssueSeverity } from './IssueSeverity';
import { RuleCategory } from './RuleCategory';

export interface RuleMetadata {

    id: string;

    title: string;

    description: string;

    severity: IssueSeverity;

    category: RuleCategory;

    autoFixSupported: boolean;

    enabledByDefault: boolean;

}