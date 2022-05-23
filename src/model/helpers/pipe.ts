/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

type operator<T> = (input: T) => T;

export const pipe = <T>(...operators: operator<T>[]) => (input: T): T => operators.reduce((output, f) => f(output), input);
