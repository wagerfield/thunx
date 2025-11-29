import type { Tag } from "./tag"
import { KeyId, TypeId } from "./tag"

/**
 * Creates a Token class with a typed `key` for dependency injection.
 *
 * @example
 * ```ts
 * class EnvService extends Token("EnvService")<{
 *   readonly BASE_URL: string
 *   readonly API_KEY: string
 * }> {}
 *
 * const instance = new EnvService({
 *   BASE_URL: "https://api.example.com",
 *   API_KEY: "super-secret-key"
 * })
 *
 * instance[KeyId] // "EnvService" (instance access to the key)
 * EnvService.key // "EnvService" (class access to the key)
 * ```
 */
export const Token = <const Key extends string>(key: Key) =>
	class Token implements Tag<"Token", Key> {
		static readonly key = key

		readonly [TypeId] = "Token"
		readonly [KeyId] = key

		constructor(shape: Record<string, unknown>) {
			Object.assign(this, shape)
		}
	} as TokenConstructor<Key>

export interface TokenConstructor<Key extends string> {
	readonly key: Key
	new <Shape extends Record<string, unknown>>(
		shape: Shape,
	): TokenInstance<Key, Shape>
}

export interface TokenClass {
	readonly key: string
	new (shape: never): Tag<"Token", string>
}

export type TokenInstance<
	Key extends string,
	Shape extends Record<string, unknown>,
> = Tag<"Token", Key> & Readonly<Shape>

export type TokenType<T> = T extends new (shape: never) => infer I ? I : never

export type TokenKey<I> = I extends Tag<"Token", infer Key> ? Key : never

/**
 * Extracts the "shape" of a token (the instance type WITHOUT the Tag properties).
 * Used by `.provide()` to allow passing just the shape instead of a full instance.
 *
 * @example
 * ```ts
 * type Shape = TokenShape<typeof FooService>
 * // { readonly foo: string } (without TypeId/KeyId)
 * ```
 */
export type TokenShape<T extends TokenClass> = Omit<
	TokenType<T>,
	TypeId | KeyId
>
