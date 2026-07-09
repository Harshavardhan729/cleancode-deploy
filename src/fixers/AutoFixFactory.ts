import { IAutoFixer } from './interfaces/IAutoFixer';
import { JavaScriptAutoFixRegistry } from './registries/JavaScriptAutoFixRegistry';
import { TypeScriptAutoFixRegistry } from './registries/TypeScriptAutoFixRegistry';
import { JavaAutoFixRegistry } from './registries/JavaAutoFixRegistry';
import { PythonAutoFixRegistry } from './registries/PythonAutoFixRegistry';
import { CSharpAutoFixRegistry } from './registries/CSharpAutoFixRegistry';
import { PhpAutoFixRegistry } from './registries/PhpAutoFixRegistry';
import { CppAutoFixRegistry } from './registries/CppAutoFixRegistry';
import { GoAutoFixRegistry } from './registries/GoAutoFixRegistry';
import { HtmlAutoFixRegistry } from './registries/HtmlAutoFixRegistry';
import { CssAutoFixRegistry } from './registries/CssAutoFixRegistry';
import { JsonAutoFixRegistry } from './registries/JsonAutoFixRegistry';
import { YamlAutoFixRegistry } from './registries/YamlAutoFixRegistry';
import { XmlAutoFixRegistry } from './registries/XmlAutoFixRegistry';
import { SqlAutoFixRegistry } from './registries/SqlAutoFixRegistry';
import { MarkdownAutoFixRegistry } from './registries/MarkdownAutoFixRegistry';

export class AutoFixFactory {

    public static getFixers(
        language: string
    ): IAutoFixer[] {

        switch (language) {

            case 'javascript':
                return JavaScriptAutoFixRegistry.getFixers();

            case 'typescript':
                return TypeScriptAutoFixRegistry.getFixers();

            case 'java':
                return JavaAutoFixRegistry.getFixers();

            case 'python':
                return PythonAutoFixRegistry.getFixers();
            
            case 'csharp':
                return CSharpAutoFixRegistry.getFixers();
            
            case 'php':
                return PhpAutoFixRegistry.getFixers();
            
            case 'cpp':
            case 'c':
                return CppAutoFixRegistry.getFixers();
            
            case 'go':
                return GoAutoFixRegistry.getFixers();
            
            case 'html':
                return HtmlAutoFixRegistry.getFixers();

            case 'css':
            case 'scss':
                return CssAutoFixRegistry.getFixers();
            
            case 'json':
                return JsonAutoFixRegistry.getFixers();

            case 'yaml':
                return YamlAutoFixRegistry.getFixers();
            
            case 'xml':
                return XmlAutoFixRegistry.getFixers();

            case 'sql':
                return SqlAutoFixRegistry.getFixers();

            case 'markdown':
                return MarkdownAutoFixRegistry.getFixers();

            default:
                return [];

        }

    }
    
    public static hasEnabledFixers(
        language: string
    ): boolean {

        return this.getFixers(language).length > 0;

    }

}