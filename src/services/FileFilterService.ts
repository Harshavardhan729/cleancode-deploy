import * as path from 'path';

import { SupportedExtensions } from '../core/constants/SupportedExtensions';

export class FileFilterService {

    public static isSupported(
        filePath: string
    ): boolean {

        if (
            filePath.endsWith('.cleancode-backup')
        ) {

            return false;

        }

        const extension =
            path.extname(filePath).toLowerCase();

        return SupportedExtensions.includes(extension);

    }

}