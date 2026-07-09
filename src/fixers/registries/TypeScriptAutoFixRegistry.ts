import { IAutoFixer } from '../interfaces/IAutoFixer';
import { JavaScriptAutoFixRegistry } from './JavaScriptAutoFixRegistry';

export class TypeScriptAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return JavaScriptAutoFixRegistry.getFixers();

    }

}