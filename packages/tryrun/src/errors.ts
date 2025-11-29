import type { Tag } from "./tag"
import { KeyId, TypeId } from "./tag"

export interface TypedErrorShape {
	readonly message?: string
	readonly cause?: unknown
	readonly [key: string]: unknown
}

/**
 * Creates a TypedError class with a typed key for error identification.
 *
 * @example
 * ```ts
 * class NotFoundError extends TypedError("NotFound")<{ readonly resource: string }> {}
 *
 * const error = new NotFoundError({ resource: "user", message: "User not found" })
 * // error[KeyId] is typed as "NotFound" (literal, not string)
 *
 * NotFoundError.key // "NotFound" - static access to the key
 * ```
 */
export const TypedError = <const Key extends string>(key: Key) =>
	class TypedError extends Error implements Tag<"Error", Key> {
		static readonly key = key

		readonly [TypeId] = "Error"
		readonly [KeyId] = key

		constructor(shape: TypedErrorShape = {}) {
			const { message, cause, ...rest } = shape
			super(message, { cause })
			Object.assign(this, rest)
		}
	} as TypedErrorConstructor<Key>

export interface TypedErrorConstructor<Key extends string> {
	readonly key: Key
	new <Shape extends Record<string, unknown> = Record<string, unknown>>(
		args?: { message?: string; cause?: unknown } & Shape,
	): TypedErrorInstance<Key, Shape>
}

export type TypedErrorInstance<
	Key extends string,
	Shape extends Record<string, unknown>,
> = Error & Tag<"Error", Key> & Readonly<Shape>

export class Failed extends TypedError("Failed") {}

export const fail = (): never => {
	throw new Failed()
}

export class Defect extends TypedError("Defect") {}

export const defect = (error?: unknown): never => {
	if (error instanceof Error) throw new Defect({ ...error })
	throw new Defect({ message: "Unexpected error", cause: error })
}
