import * as vscode from 'vscode';
import { RuleCatalogService } from '../services/RuleCatalogService';
import { RuleDetailsService } from '../services/RuleDetailsService';
import { Logger } from '../utils/Logger';

export class ListRulesCommand {

    public static readonly commandId =
        'cleancode-deploy.listRules';

    public static register(
        context: vscode.ExtensionContext
    ): void {

        const disposable = vscode.commands.registerCommand(
            ListRulesCommand.commandId,
            async () => {

                Logger.info('ListRulesCommand executed');

                const rules =
                    RuleCatalogService.getAllMetadata();

                Logger.info(`Rules found: ${rules.length}`);

                const items = rules.map(rule => ({
                    label: `${rule.id} - ${rule.title}`,
                    description: `${rule.category} | ${rule.severity}`,
                    detail: rule.description
                }));

                const selected = await vscode.window.showQuickPick(
                    items,
                    {
                        placeHolder:
                            'Registered CleanCode Rules'
                    }
                );

                Logger.info(
                    `Selected: ${selected?.label ?? 'Nothing selected'}`
                );

                if (!selected) {
                    return;
                }

                const rule = rules.find(
                    r => `${r.id} - ${r.title}` === selected.label
                );

                if (!rule) {
                    return;
                }

                await RuleDetailsService.show(rule);

            }
        );

        context.subscriptions.push(disposable);

    }

}