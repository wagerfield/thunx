import type { Tag } from "./tag"
import { KeyId, TypeId } from "./tag"

/**
 * Represents a successful `Result<T, E>` containing a `value` of type `T`.
 *
 * @typeParam T - The type of the success value
 */
export class Success<T> implements Tag<"Result", "Success"> {
	readonly [TypeId] = "Result"
	readonly [KeyId] = "Success"

	constructor(readonly value: T) {}

	isSuccess = (): this is Success<T> => true
	isFailure = (): this is Failure<never> => false
}

/**
 * Represents a failed `Result<T, E>` containing an `error` of type `E`.
 *
 * @typeParam E - The type of the error
 */
export class Failure<E> implements Tag<"Result", "Failure"> {
	readonly [TypeId] = "Result" as const
	readonly [KeyId] = "Failure" as const

	constructor(readonly error: E) {}

	isSuccess = (): this is Success<never> => false
	isFailure = (): this is Failure<E> => true
}

/**
 * A `Result<T, E>` is either a `Success<T>` containing a `value` of type `T`,
 * or a `Failure<E>` containing an `error` of type `E`.
 *
 * @typeParam T - The type of the `value` in a `Success<T>`
 * @typeParam E - The type of the `error` in a `Failure<E>`
 */
export type Result<T, E> = Success<T> | Failure<E>
