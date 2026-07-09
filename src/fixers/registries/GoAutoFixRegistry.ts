import { IAutoFixer } from '../interfaces/IAutoFixer';
import { FmtPrintlnFixer } from '../go/FmtPrintlnFixer';
import { GoTodoFixer } from '../go/GoTodoFixer';
import { GoFixmeFixer } from '../go/GoFixmeFixer';

export class GoAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return [
            new FmtPrintlnFixer(),
            new GoTodoFixer(),
            new GoFixmeFixer()
        ];

    }

}