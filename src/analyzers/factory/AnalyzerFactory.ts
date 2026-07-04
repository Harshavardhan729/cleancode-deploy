import { IAnalyzer } from '../interfaces/IAnalyzer';
import { JavaScriptAnalyzer } from '../javascript/JavaScriptAnalyzer';

export class AnalyzerFactory {

    public static getAnalyzer(language: string): IAnalyzer | undefined {

        switch (language) {

            case 'JavaScript':
            case 'TypeScript':
            case 'React JSX':
            case 'React TSX':
                return new JavaScriptAnalyzer();

            default:
                return undefined;

        }

    }

}