import { IRule } from '../interfaces/IRule';
import { ConsoleLogRule } from '../javascript/ConsoleLogRule';
import { DebuggerRule } from '../javascript/DebuggerRule';
import { ConfigurationService } from '../../services/ConfigurationService';
import { AlertRule } from '../javascript/AlertRule';
import { TodoRule } from '../javascript/TodoRule';
import { FixmeRule } from '../javascript/FixmeRule';
import { CommentedCodeRule } from '../javascript/CommentedCodeRule';

export class JavaScriptRuleRegistry {

    public static getRules(): IRule[] {

        const rules: IRule[] = [];

        if (ConfigurationService.isRuleEnabled('consoleLog')) {
            rules.push(new ConsoleLogRule());
        }

        rules.push(new DebuggerRule());
        rules.push(new AlertRule());
        rules.push(new TodoRule());
        rules.push(new FixmeRule());
        rules.push(new CommentedCodeRule());

        return rules;
    }

}