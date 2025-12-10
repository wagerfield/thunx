import type {
	ErrorHandlers,
	ErrorHandlersReturnType,
	ErrorName,
} from "./errors"
import type { Provider, TokenFactory } from "./provider"
import type { TokenClass, TokenType } from "./token"
import type {
	RetryOptions,
	TapObserver,
	UnwrapError,
	UnwrapRequirements,
	UnwrapValue,
} from "./types"

// ─────────────────────────────────────────────────────────────────────────────
// Catch Helper Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract error by name from a union.
 * Uses direct conditional instead of Extract for cleaner IDE tooltips.
 * @internal
 */
type ErrorByName<E, Name extends string> = E extends { name: Name } ? E : never

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
	 * Satisfy requirements with a Provider or direct Token + Factory.
	 * Removes provided tokens from R.
	 *
	 * @example
	 * ```ts
	 * // With Provider
	 * const runnable = prog.provide(myProvider)
	 *
	 * // Direct Token + Factory (shorthand)
	 * const runnable = prog.provide(FooService, { foo: "FOO" })
	 * ```
	 */
	provide<C>(_provider: Provider<C>): Program<T, E, Exclude<R, C>>

	provide<C extends TokenClass>(
		_token: C,
		_factory: TokenFactory<never, C>,
	): Program<T, E, Exclude<R, TokenType<C>>>

	provide<C>(
		_providerOrToken: Provider<C> | TokenClass,
		_factory?: TokenFactory<never, TokenClass>,
	): Program<T, E, Exclude<R, C>> {
		throw new Error("Program.provide not implemented")
	}

	/**
	 * Transform the success value.
	 * Can return a plain value, Promise, or another Program.
	 *
	 * @example
	 * ```ts
	 * program
	 *   .then(x => x * 2)                      // sync transform
	 *   .then(x => fetchUser(x.id))            // returns Promise
	 *   .then(x => validateUser(x))            // returns Program
	 *   .then(x => x.name)                     // back to sync
	 * ```
	 */
	then<U>(
		_fn: (value: T) => U,
	): Program<UnwrapValue<U>, E | UnwrapError<U>, R | UnwrapRequirements<U>> {
		throw new Error("Program.then not implemented")
	}

	/**
	 * Perform side effects without changing the result.
	 *
	 * @example
	 * ```ts
	 * // Success only (shorthand)
	 * program.tap(value => console.log("Got:", value))
	 *
	 * // Object observer for both
	 * program.tap({
	 *   value: v => console.log("Success:", v),
	 *   error: e => console.error("Failed:", e)
	 * })
	 * ```
	 */
	tap(_fn: (value: T) => void | Promise<void>): Program<T, E, R>

	tap(_observer: TapObserver<T, E>): Program<T, E, R>

	tap(
		_fnOrObserver: ((value: T) => void | Promise<void>) | TapObserver<T, E>,
	): Program<T, E, R> {
		throw new Error("Program.tap not implemented")
	}

	/**
	 * Catch and handle errors from the `Program`.
	 * Can return a recovery value, `Promise`, or `Program`.
	 * Use `x.fail` to re-throw or transform errors.
	 *
	 * @example
	 * ```ts
	 * // Catch all errors with a fallback value
	 * const handleAll = program.catch(() => null)
	 * // handleAll: Program<T | null, never, R>
	 *
	 * // Catch specific error by name
	 * const handleOne = program.catch("NotFoundError", () => null)
	 * // handleOne: Program<T | null, Exclude<E, NotFoundError>, R>
	 *
	 * // Catch multiple errors by name
	 * const handleSome = program.catch({
	 *   NotFoundError: () => null, // recover with null
	 *   DatabaseError: (error) => x.fail(error), // re-throw error
	 *   TimeoutError: () => x.fail(new RetryError()), // transform error
	 * })
	 * // handleSome: Program<T | null, DatabaseError | RetryError, R>
	 *
	 * // Transform errors using x.fail
	 * const transformOne = program.catch("HttpError", (error) => {
	 *   return error.status === 404
	 *     ? x.fail(new NotFoundError())
	 *     : x.fail(new ServerError())
	 * })
	 * // transformOne: Program<T, NotFoundError | ServerError, R>
	 * ```
	 */
	catch<F>(
		fn: (error: E) => F,
	): Program<T | UnwrapValue<F>, UnwrapError<F>, R | UnwrapRequirements<F>>

	catch<Name extends ErrorName<E>, F>(
		name: Name,
		fn: (error: ErrorByName<E, Name>) => F,
	): Program<
		T | UnwrapValue<F>,
		Exclude<E, { name: Name }> | UnwrapError<F>,
		R | UnwrapRequirements<F>
	>

	catch<Handlers extends ErrorHandlers<E>>(
		handlers: Handlers,
	): Program<
		T | UnwrapValue<ErrorHandlersReturnType<Handlers>>,
		| Exclude<E, { name: keyof Handlers }>
		| UnwrapError<ErrorHandlersReturnType<Handlers>>,
		R | UnwrapRequirements<ErrorHandlersReturnType<Handlers>>
	>

	catch<F>(
		_fnOrNameOrHandlers: unknown,
		_fn?: unknown,
	): Program<T | UnwrapValue<F>, unknown, R | UnwrapRequirements<F>> {
		throw new Error("Program.catch not implemented")
	}

	/**
	 * Retry the program on failure.
	 */
	retry(_policy: RetryOptions | number): Program<T, E, R> {
		throw new Error("Program.retry not implemented")
	}

	/**
	 * Add a timeout to the program.
	 */
	timeout<F = E>(_ms: number, _onTimeout?: () => F): Program<T, E | F, R> {
		throw new Error("Program.timeout not implemented")
	}

	/**
	 * Run cleanup logic regardless of success or failure.
	 * The cleanup function cannot change the result.
	 *
	 * @example
	 * ```ts
	 * program.finally(() => {
	 *   metrics.recordDuration()
	 *   cleanup()
	 * })
	 * ```
	 */
	finally(_fn: () => void | Promise<void>): Program<T, E, R> {
		throw new Error("Program.finally not implemented")
	}
}
