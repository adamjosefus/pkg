import * as styles from "../../libs/deno_std/fmt/colors.ts";
import { InfoInterruption } from "../../libs/deno_x/allo_arguments.ts";
import { formatVersion } from "../utils/formatVersion.ts";
import * as settings from "../../settings.ts";


export const versionCommand = () => {
    const message = [
        styles.bold(`Packager ${formatVersion(settings.version)}`),
        styles.gray(`Deno v${Deno.version.deno}`),
        styles.gray(`TypeScript v${Deno.version.typescript}`),
    ].join('\n');

    throw new InfoInterruption(message, () => Deno.exit(0));
}