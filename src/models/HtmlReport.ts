import { IssueExplorerItem } from './IssueExplorerItem';
import { ScanStatistics } from './ScanStatistics';

export interface HtmlReport {

    statistics: ScanStatistics;

    issues: IssueExplorerItem[];

    generatedAt: Date;

}