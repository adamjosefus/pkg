import { existsSync } from "./exists.ts";


export const filterExistPathSync = (paths: readonly string[]) => paths.filter(path => existsSync(path));


export const filterExistPath = (paths: readonly string[]) => Promise.all(paths.filter(path => existsSync(path)));
