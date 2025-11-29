import type { ContextMap } from "./context"
import type { Program } from "./program"
import type { Result } from "./result"
import type { TokenClass, TokenKey, TokenShape, TokenType } from "./token"
import type {
	ConcurrencyOptions,
	ExtractProgramTupleErrors,
	ExtractProgramTupleRequirements,
	ExtractProgramTupleValues,
	Middleware,
	ProgramValuesTuple,
	RunOptions,
} from "./types"

/**
 * The context object passed to program functions.
 * Provides type-safe access to tokens via the `get` method.
 *
 * @typeParam C - Union of token INSTANCE types available in context
 */
export interface ProgramContext<C> {
	signal: AbortSignal
	get: <K extends TokenKey<C>>(key: K) => ContextMap<C>[K]
}

/**
 * Shell for building and running programs with dependency injection.
 *
 * @typeParam C - Union of token INSTANCE types in context (both provided and required)
 * @typeParam R - Union of token INSTANCE types that still need to be provided (requirements)
 */
export class Shell<in out C = never, out R = never> {
	use(_middleware: Middleware<C>): Shell<C, R> {
		throw new Error("Shell.use not implemented")
	}

	/**
	 * Declare tokens that programs will require.
	 * These must be provided before the program can be run.
	 *
	 * @example
	 * ```ts
	 * const shell = x.require(FooService, BarService)
	 * // shell: Shell<FooService | BarService, FooService | BarService>
	 * ```
	 */
	require<T extends TokenClass[]>(
		..._tokens: T
	): Shell<C | TokenType<T[number]>, R | TokenType<T[number]>> {
		throw new Error("Shell.require not implemented")
	}

	/**
	 * Provide an implementation for a token.
	 * - If the token was required, it is removed from requirements.
	 * - The token is added to the context regardless.
	 *
	 * @example
	 * ```ts
	 * // Just pass the shape - no need to construct instance manually:
	 * const shell = x
	 *   .require(FooService)
	 *   .provide(FooService, { foo: "FOO" })
	 * // shell: Shell<FooService, never>
	 *
	 * // Providing an extra token (not required):
	 * const shell = x
	 *   .require(FooService)
	 *   .provide(BarService, { bar: "BAR" })
	 * // shell: Shell<FooService | BarService, FooService>
	 * ```
	 */
	provide<T extends TokenClass>(
		_token: T,
		_shape: TokenShape<T>,
	): Shell<C | TokenType<T>, Exclude<R, TokenType<T>>> {
		throw new Error("Shell.provide not implemented")
	}

	/**
	 * Create a program that can access tokens via the context.
	 *
	 * @example
	 * ```ts
	 * const prog = shell.try((ctx) => {
	 *   const { foo } = ctx.get("FooService")
	 *   return { foo }
	 * })
	 * ```
	 */
	try<T, E = unknown, F = never>(
		_fn: (context: ProgramContext<C>) => T | Promise<T> | Program<T, E, R>,
		_catch?: (error: E) => F,
	): Program<T, F, R> {
		throw new Error("Shell.try not implemented")
	}

	fail<E>(_error: E): Program<never, E, R> {
		throw new Error("Shell.fail not implemented")
	}

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

	any<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("Shell.any not implemented")
	}

	race<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("Shell.race not implemented")
	}

	run<T, E, Options extends RunOptions>(
		_program: Program<T, E, never>,
		_options?: Options,
	): Options["mode"] extends "unwrap" ? Promise<T> : Promise<Result<T, E>> {
		throw new Error("Shell.run not implemented")
	}
}
