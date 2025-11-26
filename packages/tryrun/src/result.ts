export type Success<T> = {
	readonly success: true
	readonly value: T
}

export type Failure<E> = {
	readonly success: false
	readonly error: E
}

export type Result<T, E> = Success<T> | Failure<E>

export const Result = {
	value: <T>(value: T): Result<T, never> => ({ success: true, value }),
	error: <E>(error: E): Result<never, E> => ({ success: false, error }),

	isSuccess: <T, E>(result: Result<T, E>): result is Success<T> =>
		result.success,

	isFailure: <T, E>(result: Result<T, E>): result is Failure<E> =>
		!result.success,

	match: <T, E, U, F>(
		result: Result<T, E>,
		mappers: {
			success: (value: T) => U
			failure: (error: E) => F
		},
	): U | F =>
		result.success
			? mappers.success(result.value)
			: mappers.failure(result.error),
}
