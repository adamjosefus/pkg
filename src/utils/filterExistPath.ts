import { existsSync } from "./exists.ts";


export const filterExistPathSync = (paths: string[]) => paths.filter(path => existsSync(path));


export const filterExistPath = (paths: string[]) => Promise.all(paths.filter(path => existsSync(path)));
