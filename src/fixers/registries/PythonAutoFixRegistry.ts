import { IAutoFixer } from '../interfaces/IAutoFixer';
import { PrintFixer } from '../python/PrintFixer';
import { PythonTodoFixer } from '../python/PythonTodoFixer';
import { PythonFixmeFixer } from '../python/PythonFixmeFixer';

export class PythonAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return [
            new PrintFixer(),
            new PythonTodoFixer(),
            new PythonFixmeFixer()
        ];

    }

}