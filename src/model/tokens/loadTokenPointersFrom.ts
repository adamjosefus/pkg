/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { JSONC } from "../../libs/jsonc.ts";
import { ExpectedException } from "../../libs/allo_arguments.ts";
import { existsSync } from "../helpers/existsSync.ts";
import { type TokenPointerType } from "./TokenPointerType.ts";


/**
 * Load token pointers from a JSON/JSOC file.
 * @param file 
 * @returns If the file not exists, return `null`.
 */
export function loadTokenPointersFrom(file: string): TokenPointerType[] | null {
    if (!existsSync(file)) return null;
    const content = Deno.readTextFileSync(file);

    try {
        return JSONC.parse(content) as TokenPointerType[];
    } catch (_error) {
        throw new ExpectedException(`Failed to parse file "${file}"`);
    }
}
