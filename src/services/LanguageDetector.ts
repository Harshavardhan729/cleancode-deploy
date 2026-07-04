import * as path from 'path';
import { LanguageInfo } from '../models/LanguageInfo';

export class LanguageDetector {

    private static readonly languageMap = new Map<string, string>([

        ['.js', 'JavaScript'],
        ['.ts', 'TypeScript'],
        ['.jsx', 'React JSX'],
        ['.tsx', 'React TSX'],

        ['.py', 'Python'],

        ['.java', 'Java'],

        ['.cs', 'C#'],

        ['.cpp', 'C++'],
        ['.c', 'C'],

        ['.go', 'Go'],

        ['.php', 'PHP'],

        ['.html', 'HTML'],
        ['.css', 'CSS'],

        ['.scss', 'SCSS'],

        ['.json', 'JSON'],

        ['.xml', 'XML'],

        ['.sql', 'SQL'],

        ['.yml', 'YAML'],
        ['.yaml', 'YAML'],

        ['.md', 'Markdown']

    ]);

    public static detect(filePath: string): LanguageInfo {

        const extension = path.extname(filePath).toLowerCase();

        return {

            extension,

            language:
                this.languageMap.get(extension) ??
                'Unknown'

        };
    }

}