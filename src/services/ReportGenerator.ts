import { Logger } from '../utils/Logger';
import { ScanReport } from '../models/ScanReport';

export class ReportGenerator {

    public static print(report: ScanReport): void {

        Logger.info('====================================');
        Logger.info(' CleanCode Deploy Scan Report');
        Logger.info('====================================');

        Logger.info(`Workspace : ${report.workspacePath}`);
        Logger.info(`Total Files : ${report.totalFiles}`);

        Logger.info('');
        Logger.info('Languages');

        report.languages.forEach((count, language) => {

            Logger.info(`${language} : ${count}`);

        });

        Logger.info('====================================');

    }

}