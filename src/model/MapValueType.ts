/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

// deno-lint-ignore no-explicit-any
export type MapValueType<A> = A extends Record<any, infer V> ? V : never;
