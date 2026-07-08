import { IAutoFixer } from './interfaces/IAutoFixer';

import { ConsoleLogFixer } from './javascript/ConsoleLogFixer';
import { DebuggerFixer } from './javascript/DebuggerFixer';
import { AlertFixer } from './javascript/AlertFixer';
import { TodoFixer } from './javascript/TodoFixer';
import { FixmeFixer } from './javascript/FixmeFixer';
import { CommentedCodeFixer } from './javascript/CommentedCodeFixer';

import { ConfigurationService } from '../services/ConfigurationService';

export class AutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        const fixers: IAutoFixer[] = [];

        if (ConfigurationService.isRuleEnabled('consoleLog')) {
            fixers.push(new ConsoleLogFixer());
        }

        if (ConfigurationService.isRuleEnabled('debugger')) {
            fixers.push(new DebuggerFixer());
        }

        if (ConfigurationService.isRuleEnabled('alert')) {
            fixers.push(new AlertFixer());
        }

        if (ConfigurationService.isRuleEnabled('todo')) {
            fixers.push(new TodoFixer());
        }

        if (ConfigurationService.isRuleEnabled('fixme')) {
            fixers.push(new FixmeFixer());
        }

        if (ConfigurationService.isRuleEnabled('commentedCode')) {
            fixers.push(new CommentedCodeFixer());
        }

        return fixers;

    }

}