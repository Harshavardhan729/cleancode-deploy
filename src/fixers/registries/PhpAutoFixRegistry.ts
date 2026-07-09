import { IAutoFixer } from '../interfaces/IAutoFixer';
import { PhpEchoFixer } from '../php/PhpEchoFixer';
import { PhpTodoFixer } from '../php/PhpTodoFixer';
import { PhpFixmeFixer } from '../php/PhpFixmeFixer';

export class PhpAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return [
            new PhpEchoFixer(),
            new PhpTodoFixer(),
            new PhpFixmeFixer()
        ];

    }

}