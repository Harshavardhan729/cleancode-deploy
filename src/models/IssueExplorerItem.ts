import { IssueSeverity } from './IssueSeverity';

export type IssueExplorerItemType =
    'file' |
    'issue';

export interface IssueExplorerItem {

    type: IssueExplorerItemType;

    label: string;

    file?: string;

    line?: number;

    column?: number;

    severity?: IssueSeverity;

    children?: IssueExplorerItem[];

}