import { IAutoFixer } from '../interfaces/IAutoFixer';
import { AutoFixCategory } from '../../models/AutoFixCategory';

export class CommentedCodeFixer implements IAutoFixer {

    public readonly name = 'commented code';

    public readonly language = 'javascript';

    public readonly category =
        AutoFixCategory.Comment;

    public canFix(
        line: string
    ): boolean {

        const trimmed =
            line.trim();

        if (!trimmed.startsWith('//')) {
            return false;
        }

        const comment =
            trimmed.substring(2).trim();

        return comment.includes(';') ||
            comment.includes('{') ||
            comment.includes('}') ||
            comment.includes('(') ||
            comment.includes('=') ||
            comment.startsWith('if ') ||
            comment.startsWith('for ') ||
            comment.startsWith('while ') ||
            comment.startsWith('return ') ||
            comment.startsWith('const ') ||
            comment.startsWith('let ') ||
            comment.startsWith('var ') ||
            comment.startsWith('function ');

    }

}