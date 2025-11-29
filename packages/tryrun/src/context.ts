import type { TokenKey } from "./token"

/**
 * Creates a typed context map from a union of token instance types.
 * Maps from token key (KeyId value) to the instance type.
 *
 * @example
 * ```ts
 * type Ctx = ContextMap<FooService | BarService>
 * // {
 * //   "FooService": FooService
 * //   "BarService": BarService
 * // }
 * ```
 */
export type ContextMap<Instances> = {
	[I in Instances as TokenKey<I>]: I
}

export interface Context<Instances> {
	/**
	 * Get a token instance by its key.
	 * The key must be one of the registered token keys.
	 */
	get<K extends TokenKey<Instances>>(key: K): ContextMap<Instances>[K]
}

/**
 * Creates a typed context from a record of token instances.
 */
export const createContext = <Instances>(
	tokens: ContextMap<Instances>,
): Context<Instances> => ({
	get: <K extends TokenKey<Instances>>(key: K): ContextMap<Instances>[K] =>
		tokens[key],
})
