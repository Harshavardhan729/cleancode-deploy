import { ScanStatistics } from '../models/ScanStatistics';

export class StatisticsService {

    private static statistics?: ScanStatistics;

    public static update(
        statistics: ScanStatistics
    ): void {

        this.statistics = statistics;

    }

    public static get():
        ScanStatistics | undefined {

        return this.statistics;

    }

    public static clear(): void {

        this.statistics = undefined;

    }

}