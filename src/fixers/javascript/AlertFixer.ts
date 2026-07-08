import { IAutoFixer } from '../interfaces/IAutoFixer';

export class AlertFixer implements IAutoFixer {

    public readonly name = 'alert';

    public canFix(
        line: string
    ): boolean {

        return line.includes('alert(');

    }

}