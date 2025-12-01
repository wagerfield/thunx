import type { Context } from "./context"
import type { TokenClass, TokenKey, TokenShape, TokenType } from "./token"

/**
 * Factory type for creating token implementations.
 * Can be a direct value or a function that receives context.
 */
export type TokenFactory<C, T extends TokenClass> =
	| TokenShape<T>
	| ((ctx: Context<C>) => TokenShape<T>)

/**
 * Internal record of token factories keyed by token key.
 */
export type FactoryRecord = Map<string, TokenFactory<unknown, TokenClass>>

/**
 * A composable recipe for building token implementations.
 * Each `.provide()` returns a new Provider with the additional factory.
 *
 * @typeParam C - Union of token INSTANCE types that have been provided
 *
 * @example
 * ```ts
 * const base = provider()
 *   .provide(EnvService, { DATABASE_URL: "postgres://..." })
 *   .provide(LoggerService, (ctx) => ({
 *     log: (msg) => console.log(msg)
 *   }))
 * ```
 */
export class Provider<out C = never> {
	/** @internal */
	readonly _factories: FactoryRecord

	/** @internal */
	constructor(factories?: FactoryRecord) {
		this._factories = factories ?? new Map()
	}

	/**
	 * Add a token implementation to the provider.
	 * Returns a new Provider with the additional factory.
	 *
	 * @param token - The token class to provide
	 * @param factory - The implementation (value or factory function)
	 */
	provide<T extends TokenClass>(
		token: T,
		factory: TokenFactory<C, T>,
	): Provider<C | TokenType<T>> {
		const factories = new Map(this._factories)
		factories.set(token.key, factory as TokenFactory<unknown, TokenClass>)
		return new Provider(factories)
	}

	/**
	 * Get the factory for a token.
	 *
	 * @param token - The token class to retrieve
	 * @returns The factory for the token
	 */
	get<T extends TokenClass & { key: TokenKey<C> }>(
		token: T,
	): TokenFactory<C, T> {
		const factory = this._factories.get(token.key)
		if (!factory) {
			throw new Error(`Token "${token.key}" not provided`)
		}
		return factory as TokenFactory<C, T>
	}

	/**
	 * Create a new Provider with only the specified tokens.
	 *
	 * @param tokens - The token classes to include
	 * @returns A new Provider with only the specified tokens
	 */
	pick<T extends TokenClass & { key: TokenKey<C> }>(
		...tokens: T[]
	): Provider<TokenType<T>> {
		const factories = new Map<string, TokenFactory<unknown, TokenClass>>()
		for (const token of tokens) {
			const factory = this._factories.get(token.key)
			if (factory) factories.set(token.key, factory)
		}
		return new Provider(factories)
	}

	/**
	 * Create a new Provider without the specified tokens.
	 *
	 * @param tokens - The token classes to exclude
	 * @returns A new Provider without the specified tokens
	 */
	omit<T extends TokenClass & { key: TokenKey<C> }>(
		...tokens: T[]
	): Provider<Exclude<C, TokenType<T>>> {
		const factories = new Map(this._factories)
		for (const token of tokens) {
			factories.delete(token.key)
		}
		return new Provider(factories)
	}
}

/**
 * Create an empty Provider.
 *
 * @example
 * ```ts
 * const p = provider()
 *   .provide(FooService, { foo: "FOO" })
 *   .provide(BarService, (ctx) => ({ bar: ctx.get(FooService).foo }))
 * ```
 */
export const provider = (): Provider<never> => new Provider()
