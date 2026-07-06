import { IssueExplorerItem } from '../models/IssueExplorerItem';
import { IssueTreeDataProvider } from '../views/IssueTreeDataProvider';

export class IssueExplorerService {

    private static provider?: IssueTreeDataProvider;

    public static register(
        provider: IssueTreeDataProvider
    ): void {

        this.provider = provider;

    }

    public static update(
        issues: IssueExplorerItem[]
    ): void {

        this.provider?.setIssues(issues);

    }

}