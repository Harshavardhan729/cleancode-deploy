import * as path from 'path';

import { SupportedExtensions } from '../core/constants/SupportedExtensions';

export class FileFilterService {

    public static isSupported(
        filePath: string
    ): boolean {

        const extension = path.extname(filePath).toLowerCase();

        return SupportedExtensions.includes(extension);

    }

}