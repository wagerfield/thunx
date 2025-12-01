import type { Provider, TokenFactory } from "./provider"
import type { TokenClass, TokenKey, TokenType } from "./token"

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

/**
 * A resolved runtime context that lazily resolves and caches token instances.
 * Created internally when running a program.
 *
 * @typeParam C - Union of token INSTANCE types available in this context
 */
export class Context<C = never> {
	readonly signal: AbortSignal

	/** @internal */
	private readonly _provider: Provider<C>

	/** @internal */
	private readonly _cache: Map<string, unknown> = new Map()

	/** @internal */
	private readonly _resolving: Set<string> = new Set()

	/** @internal */
	constructor(provider: Provider<C>, signal?: AbortSignal) {
		this._provider = provider
		this.signal = signal ?? new AbortController().signal
	}

	/**
	 * Get a token instance by token class.
	 * Lazily resolves on first access, then cached.
	 *
	 * @param token - The token class to retrieve
	 * @returns The resolved token instance
	 *
	 * @example
	 * ```ts
	 * const env = ctx.get(EnvService)
	 * const db = ctx.get(DatabaseService)
	 * ```
	 */
	get<T extends TokenClass & { key: TokenKey<C> }>(token: T): TokenType<T> {
		const key = token.key

		// Return cached instance if available
		if (this._cache.has(key)) {
			return this._cache.get(key) as TokenType<T>
		}

		// Detect circular dependencies
		if (this._resolving.has(key)) {
			throw new Error(`Circular dependency detected: "${key}"`)
		}

		// Mark as resolving
		this._resolving.add(key)

		try {
			const factory = this._provider.get(token)
			const instance = this._resolve(factory)
			this._cache.set(key, instance)
			return instance as TokenType<T>
		} finally {
			this._resolving.delete(key)
		}
	}

	/** @internal */
	private _resolve(factory: TokenFactory<C, TokenClass>): unknown {
		if (typeof factory === "function") {
			// Safe cast: the context has all tokens from the provider
			// biome-ignore lint/suspicious/noExplicitAny: internal implementation
			return factory(this as any)
		}
		return factory
	}
}
