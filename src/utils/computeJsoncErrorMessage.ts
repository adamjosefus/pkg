import { JSONC, parseErrorReaon } from "../../libs/esm/jsonc-parser/mod.ts";
import * as styles from "./styles.ts";


/**
 * Computes the error message from the given JSONC parse error. Petty with colors.
 */
export const computeJsoncErrorMessage = (content: string, { error: code, offset, length }: JSONC.ParseError) => {
    const reason = parseErrorReaon(code);

    const margin = 50;
    const prefix = content.substring(Math.max(0, offset - margin), offset);
    const suffix = content.substring(offset + length, Math.min(offset + length + margin, content.length));
    const line = content.substring(offset, offset + length);

    return `${reason}: ${prefix}${styles.error(line)}${suffix}`;
}
