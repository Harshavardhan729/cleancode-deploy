import * as vscode from 'vscode';
import { IssueExplorerItem } from '../models/IssueExplorerItem';
import { IssueTreeDataProvider } from '../views/IssueTreeDataProvider';

export class IssueExplorerService {

    private static provider?: IssueTreeDataProvider;

    private static treeView?: vscode.TreeView<IssueExplorerItem>;

    private static currentIssues: IssueExplorerItem[] = [];

    public static register(
        provider: IssueTreeDataProvider,
        treeView: vscode.TreeView<IssueExplorerItem>
    ): void {

        this.provider = provider;
        this.treeView = treeView;

    }

    public static update(
        items: IssueExplorerItem[]
    ): void {

        this.currentIssues = items;

        this.provider?.setIssues(items);

        const issueCount = items.reduce(
            (total, item) =>
                total + (item.children?.length ?? 0),
            0
        );

        if (this.treeView) {

            this.treeView.title =
                issueCount === 0
                    ? 'Issue Explorer'
                    : `Issue Explorer (${issueCount})`;

        }

    }

    public static clear(): void {

        this.currentIssues = [];

        this.provider?.setIssues([]);

        if (this.treeView) {

            this.treeView.title =
                'Issue Explorer';

        }

    }
    
    public static getIssues(): IssueExplorerItem[] {

        return this.currentIssues;

    }

}