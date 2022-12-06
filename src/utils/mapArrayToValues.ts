export const mapArrayToValues = <T, K extends keyof T>(key: K) => (array: T[]) => array.map(item => item[key]);
