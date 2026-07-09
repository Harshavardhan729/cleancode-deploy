import { IAutoFixer } from '../interfaces/IAutoFixer';
import { ConsoleWriteLineFixer } from '../csharp/ConsoleWriteLineFixer';
import { CSharpTodoFixer } from '../csharp/CSharpTodoFixer';
import { CSharpFixmeFixer } from '../csharp/CSharpFixmeFixer';

export class CSharpAutoFixRegistry {

    public static getFixers(): IAutoFixer[] {

        return [
            new ConsoleWriteLineFixer(),
            new CSharpTodoFixer(),
            new CSharpFixmeFixer()
        ];

    }

}