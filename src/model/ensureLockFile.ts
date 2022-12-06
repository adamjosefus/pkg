import { exists } from "../utils/exists.ts";
import { prettyJson } from "../utils/prettyJson.ts";

export const ensureLockFile = async (file: string) => {
    if (await exists(file)) return;

    const content = prettyJson({});

    console.log({content});
    

    await Deno.writeTextFile(file, content, {
        create: true,
        append: false,
    });
}
