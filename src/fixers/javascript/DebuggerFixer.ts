import { IAutoFixer } from '../interfaces/IAutoFixer';

export class DebuggerFixer implements IAutoFixer {

    public readonly name = 'debugger';

    public canFix(
        line: string
    ): boolean {

        return line.trim().startsWith('debugger');

    }

}