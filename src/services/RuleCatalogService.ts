import { IRule } from '../rules/interfaces/IRule';
import { JavaScriptRuleRegistry } from '../rules/registry/JavaScriptRuleRegistry';
import { RuleMetadata } from '../models/RuleMetadata';

export class RuleCatalogService {

    public static getAllRules(): IRule[] {

        return [
            ...JavaScriptRuleRegistry.getRules()
        ];

    }

    public static getAllMetadata(): RuleMetadata[] {

        return this.getAllRules().map(
            rule => rule.metadata
        );

    }

}