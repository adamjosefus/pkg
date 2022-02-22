
export const variableFilters: Map<string, (s: string) => string> = new Map();

variableFilters.set("encodeUri", (s: string) => encodeURI(s));

variableFilters.set("encodeUriComponent", (s: string) => encodeURIComponent(s));
