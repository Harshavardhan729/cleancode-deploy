import * as path from 'path';
import { LanguageInfo } from '../models/LanguageInfo';

export class LanguageDetector {

    private static readonly languageMap = new Map<string, string>([

        ['.js', 'javascript'],
        ['.ts', 'typescript'],
        ['.jsx', 'javascriptreact'],
        ['.tsx', 'typescriptreact'],

        ['.py', 'python'],

        ['.java', 'java'],

        ['.cs', 'csharp'],

        ['.cpp', 'cpp'],
        ['.c', 'c'],

        ['.go', 'go'],

        ['.php', 'php'],

        ['.html', 'html'],
        ['.css', 'css'],

        ['.scss', 'scss'],

        ['.json', 'json'],

        ['.xml', 'xml'],

        ['.sql', 'sql'],

        ['.yml', 'yaml'],
        ['.yaml', 'yaml'],

        ['.md', 'markdown']

    ]);

    public static detect(filePath: string): LanguageInfo {

        const extension = path.extname(filePath).toLowerCase();

        return {

            extension,

            language:
                this.languageMap.get(extension) ??
                'unknown'

        };

    }

}