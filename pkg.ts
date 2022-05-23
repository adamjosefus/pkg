import { run as runPackager } from "./src/main.ts";


if (import.meta.main) {
    await runPackager();
}
