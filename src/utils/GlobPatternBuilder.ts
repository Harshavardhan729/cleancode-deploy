import { IGNORED_FOLDERS } from '../core/constants/IgnoredFolders';

export class GlobPatternBuilder {

    public static buildExcludePattern(): string {

        return `{${IGNORED_FOLDERS.map(folder => `**/${folder}/**`).join(',')}}`;
    }

}