import type { Context } from "./context"
import type { Program } from "./program"
import type { Provider, TokenFactory } from "./provider"
import type { Result } from "./result"
import type { TokenClass, TokenType } from "./token"
import type {
	ConcurrencyOptions,
	ExtractProgramTupleErrors,
	ExtractProgramTupleRequirements,
	ExtractProgramTupleValues,
	Middleware,
	ProgramValuesTuple,
	RunOptions,
	UnwrapError,
	UnwrapRequirements,
	UnwrapValue,
} from "./types"

/**
 * Shell for declaring requirements and creating programs.
 *
 * @typeParam R - Union of token INSTANCE types required by programs created from this shell
 *
 * @example
 * ```ts
 * const shell = x.require(FooService, BarService)
 * const prog = shell.try((ctx) => {
 *   const foo = ctx.get(FooService)
 *   return foo.value
 * })
 * ```
 */
export class Shell<R = never> {
	/**
	 * Add middleware to the shell.
	 */
	use(_middleware: Middleware<R>): Shell<R> {
		throw new Error("Shell.use not implemented")
	}

	/**
	 * Declare tokens that programs will require.
	 * These must be provided before the program can be run.
	 *
	 * @example
	 * ```ts
	 * const shell = x.require(FooService, BarService)
	 * // shell: Shell<FooService | BarService>
	 * ```
	 */
	require<T extends TokenClass[]>(
		..._tokens: T
	): Shell<R | TokenType<T[number]>> {
		throw new Error("Shell.require not implemented")
	}

	/**
	 * Create a Provider with an initial token.
	 * Convenience method equivalent to `provider().provide(token, factory)`.
	 *
	 * @example
	 * ```ts
	 * const p = x.provide(FooService, { foo: "FOO" })
	 * // p: Provider<FooService>
	 *
	 * const p2 = p.provide(BarService, (ctx) => ({ bar: ctx.get(FooService).foo }))
	 * // p2: Provider<FooService | BarService>
	 * ```
	 */
	provide<T extends TokenClass>(
		_token: T,
		_factory: TokenFactory<never, T>,
	): Provider<TokenType<T>> {
		throw new Error("Shell.provide not implemented")
	}

	/**
	 * Create a program that can access required tokens via context.
	 * The callback can return a plain value, Promise, or another Program.
	 *
	 * @example
	 * ```ts
	 * // Return a value
	 * const prog = shell.try((ctx) => ctx.get(FooService).value)
	 *
	 * // Return a Promise
	 * const prog = shell.try((ctx) => fetchUser(ctx.get(Config).userId))
	 *
	 * // Return another Program (for composition)
	 * const prog = shell.try((ctx) => {
	 *   if (ctx.get(Config).useCache) {
	 *     return getCachedUser()  // Returns Program
	 *   }
	 *   return fetchUser()        // Returns Program
	 * })
	 * ```
	 */
	try<T, E = unknown>(
		_fn: (context: Context<R>) => T,
		_catch?: (error: unknown) => E,
	): Program<UnwrapValue<T>, E | UnwrapError<T>, R | UnwrapRequirements<T>> {
		throw new Error("Shell.try not implemented")
	}

	/**
	 * Create a program that immediately fails with the given error.
	 */
	fail<E>(_error: E): Program<never, E, R> {
		throw new Error("Shell.fail not implemented")
	}

	/**
	 * Combine multiple programs, running them all and collecting results.
	 */
	all<T extends readonly Program[]>(
		_programs: T,
		_options?: ConcurrencyOptions,
	): Program<
		ProgramValuesTuple<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("Shell.all not implemented")
	}

	/**
	 * Run multiple programs, returning the first success.
	 */
	any<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("Shell.any not implemented")
	}

	/**
	 * Run multiple programs, returning the first to complete.
	 */
	race<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("Shell.race not implemented")
	}

	/**
	 * Run a program that has no outstanding requirements.
	 *
	 * @example
	 * ```ts
	 * const result = await x.run(program)
	 * if (result.isSuccess()) {
	 *   console.log(result.value)
	 * }
	 * ```
	 */
	run<T, E, Options extends RunOptions>(
		_program: Program<T, E, never>,
		_options?: Options,
	): Options["mode"] extends "unwrap" ? Promise<T> : Promise<Result<T, E>> {
		throw new Error("Shell.run not implemented")
	}
}
