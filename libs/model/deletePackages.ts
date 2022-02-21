/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { ConfigType } from "../types/ConfigType.ts";
import * as styles from "../helpers/styles.ts";


function print(name: string, columnLength: number, success: boolean, message: string) {
    console.log(
        `> ${name.padEnd(columnLength)}`,
        success
            ? styles.success('delete OK')
            : styles.error('delete FAILED'),
    );

    if (message.trim() !== '') {
        console.log(styles.note(`>> ${message}`));
    }
}


export async function deletePackages(config: ConfigType): Promise<void> {
    const length = config.map(x => x.reference).reduce((a, b) => Math.max(a, b.length), 0);

    for (const item of config) {
        let success: boolean;
        let message: string;

        try {
            await Deno.remove(item.destinationDir, { recursive: true });
            success = true;
            message = '';
        } catch (error) {
            success = false;
            message = error.toString();
        }

        print(item.reference, length + 5, success, message);
    }
}
