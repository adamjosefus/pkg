/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { block as blck, list } from "../model/helpers/styles.ts";
import { cleanTokenOrigin, loadGlobalTokensFrom, saveGlobalTokensTo, TokenType } from "../model/tokens/mod.ts";


async function updateTokens(root: string, tokens: TokenType[]) {
    const store = await loadGlobalTokensFrom(root);

    // Add tokens to store
    tokens.map(({ origin, ...rest }) => {
        return {
            ...rest,
            origin: cleanTokenOrigin(origin),
        };
    }).forEach(({ origin, secret }) => {
        const index = store.findIndex(({ origin: o }) => o === origin);

        if (index === -1) {
            // Add new token
            store.push({ origin, secret });
        } else {
            // Replace old token
            store.splice(index, 1, { origin, secret });
        }
    });

    await saveGlobalTokensTo(root, store);
}


export async function addGlobalTokens(root: string, tokens: TokenType[]) {
    // Prepare
    const origins = tokens.map(({ origin }) => origin);
    
    // Print tokens
    console.log(blck.header(`Adding global tokens...`));
    console.log(''); // New line
    console.log(list(origins));

    // Update tokens
    await updateTokens(root, tokens);

    // Outro
    console.log(''); // New line
}
