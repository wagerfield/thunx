import type { Provider } from "./provider"
import type {
	RetryPolicy,
	UnwrapError,
	UnwrapRequirements,
	UnwrapValue,
} from "./types"

/**
 * A program that produces a value of type T, may fail with error E,
 * and requires token implementations R to be provided before it can run.
 *
 * @typeParam T - Success value type
 * @typeParam E - Failure error type
 * @typeParam R - Union of required token types (must be `never` to run)
 *
 * @example
 * ```ts
 * const prog = shell.try((ctx) => ctx.get(FooService).value)
 * // prog: Program<string, unknown, FooService>
 *
 * const runnable = prog.provide(fooProvider)
 * // runnable: Program<string, unknown, never>
 * ```
 */
export class Program<out T = unknown, out E = unknown, out R = never> {
	private constructor() {}

	/**
	 * Satisfy requirements with a Provider.
	 * Removes provided tokens from R.
	 *
	 * @example
	 * ```ts
	 * const prog = shell.try(ctx => ctx.get(FooService))
	 * // prog: Program<Foo, unknown, FooService>
	 *
	 * const runnable = prog.provide(x.provide(FooService, { foo: "FOO" }))
	 * // runnable: Program<Foo, unknown, never>
	 * ```
	 */
	provide<C>(_provider: Provider<C>): Program<T, E, Exclude<R, C>> {
		throw new Error("Program.provide not implemented")
	}

	/**
	 * Transform the success value.
	 * Can return a plain value, Promise, or another Program.
	 *
	 * @example
	 * ```ts
	 * program
	 *   .map(x => x * 2)                      // sync transform
	 *   .map(x => fetchUser(x.id))            // returns Promise
	 *   .map(x => validateUser(x))            // returns Program
	 *   .map(x => x.name)                     // back to sync
	 * ```
	 */
	map<U>(
		_fn: (value: T) => U,
	): Program<UnwrapValue<U>, E | UnwrapError<U>, R | UnwrapRequirements<U>> {
		throw new Error("Program.map not implemented")
	}

	/**
	 * Transform the error value.
	 * Can return a plain value, Promise, or another Program.
	 */
	mapError<F>(
		_fn: (error: E) => F,
	): Program<T | UnwrapValue<F>, UnwrapError<F>, R | UnwrapRequirements<F>> {
		throw new Error("Program.mapError not implemented")
	}

	/**
	 * Perform a side effect on success.
	 */
	tap(_fn: (value: T) => void | Promise<void>): Program<T, E, R> {
		throw new Error("Program.tap not implemented")
	}

	/**
	 * Perform a side effect on error.
	 */
	tapError(_fn: (error: E) => void | Promise<void>): Program<T, E, R> {
		throw new Error("Program.tapError not implemented")
	}

	/**
	 * Catch and recover from errors.
	 * Can return a plain value, Promise, or another Program.
	 *
	 * @example
	 * ```ts
	 * program
	 *   .catch(err => defaultValue)           // recover with value
	 *   .catch(err => fetchFallback())        // recover with Promise
	 *   .catch(err => fallbackProgram(err))   // recover with Program
	 * ```
	 */
	catch<F>(
		_fn: (error: E) => F,
	): Program<T | UnwrapValue<F>, UnwrapError<F>, R | UnwrapRequirements<F>> {
		throw new Error("Program.catch not implemented")
	}

	/**
	 * Retry the program on failure.
	 */
	retry(_policy: RetryPolicy | number): Program<T, E, R> {
		throw new Error("Program.retry not implemented")
	}

	/**
	 * Add a timeout to the program.
	 */
	timeout<F = E>(_ms: number, _onTimeout?: () => F): Program<T, E | F, R> {
		throw new Error("Program.timeout not implemented")
	}

	/**
	 * Recover from errors with an alternative program.
	 * @deprecated Use `.catch()` instead, which now accepts Programs.
	 */
	orElse<U, F, S>(
		_fn: (error: E) => Program<U, F, S>,
	): Program<T | U, F, R | S> {
		throw new Error("Program.orElse not implemented")
	}
}
