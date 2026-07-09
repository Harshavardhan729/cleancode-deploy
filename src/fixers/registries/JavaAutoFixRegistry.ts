import { IAutoFixer } from '../interfaces/IAutoFixer';
import { SystemOutPrintlnFixer } from '../java/SystemOutPrintlnFixer';
import { JavaTodoFixer } from '../java/JavaTodoFixer';
import { JavaFixmeFixer } from '../java/JavaFixmeFixer';

export class JavaAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return [
            new SystemOutPrintlnFixer(),
            new JavaTodoFixer(),
            new JavaFixmeFixer()
        ];

    }

}