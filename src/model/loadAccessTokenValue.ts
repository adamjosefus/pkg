import { absurd } from "../../libs/esm/fp-ts/function.ts";
import { type Config } from "../types/Config.ts";
import { createAsyncFunction } from "../utils/createAsyncFunction.ts";
import { ObjectValue } from "../types.ts";
import { makeAbsolute } from "../utils/makeAbsolute.ts";


/**
 * Just wrapper for same convention
 */
const fromSecret = (secret: string) => {
    return secret;
}

const fromFile = (path: string) => {
    return Deno.readTextFileSync(path);
}

const fromEnv = (name: string) => {
    return Deno.env.get(name);
}


type AccessToken = ObjectValue<NonNullable<Config['accessTokens']>>;


export const loadAccessTokenValueSync = (options: AccessToken, root: string): string | undefined => {
    if (typeof options === 'string') {
        // If the value is a string, it is the access token itself
        return fromSecret(options);
    }

    if ('file' in options) return fromFile(makeAbsolute(root, options.file));
    if ('env' in options) return fromEnv(options.env);
    if ('secret' in options) return fromSecret(options.secret);

    return absurd(options) as never;
}


export const loadAccessTokenValue = createAsyncFunction(loadAccessTokenValueSync);
