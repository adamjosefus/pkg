import { createTypescriptType } from "./serializers/createTypescriptType.ts";
import { configType } from "./configSchema.ts";


export async function generateConfigTypeFile() {
    const content = createTypescriptType(configType);

    Deno.writeTextFileSync('./_dummy.ts', content);

    return content;
}


console.log('');
console.log(await generateConfigTypeFile());
console.log('');

