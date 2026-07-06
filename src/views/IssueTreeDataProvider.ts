import * as vscode from 'vscode';
import { IssueExplorerItem } from '../models/IssueExplorerItem';

export class IssueTreeDataProvider
    implements vscode.TreeDataProvider<IssueExplorerItem> {

    private readonly _onDidChangeTreeData =
        new vscode.EventEmitter<void>();

    readonly onDidChangeTreeData =
        this._onDidChangeTreeData.event;

    private items: IssueExplorerItem[] = [];

    public setIssues(
        items: IssueExplorerItem[]
    ): void {

        this.items = items;
        this._onDidChangeTreeData.fire();

    }

    getTreeItem(
        element: IssueExplorerItem
    ): vscode.TreeItem {

        const collapsibleState =
            element.type === 'file'
                ? vscode.TreeItemCollapsibleState.Expanded
                : vscode.TreeItemCollapsibleState.None;

        const treeItem = new vscode.TreeItem(
            element.label,
            collapsibleState
        );

        if (element.type === 'issue') {

            treeItem.command = {
                command: 'cleancode-deploy.openIssue',
                title: 'Open Issue',
                arguments: [element]
            };

        }

        return treeItem;

    }

    getChildren(
        element?: IssueExplorerItem
    ): Thenable<IssueExplorerItem[]> {

        if (element) {
            return Promise.resolve(
                element.children ?? []
            );
        }

        if (this.items.length === 0) {
            return Promise.resolve([
                {
                    type: 'issue',
                    label: 'No issues'
                }
            ]);
        }

        return Promise.resolve(this.items);

    }

}