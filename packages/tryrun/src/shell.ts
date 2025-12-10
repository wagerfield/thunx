import type { Context } from "./context"
import type { Program } from "./program"
import type { Provider, TokenFactory } from "./provider"
import type { Result } from "./result"
import type { TokenClass, TokenType } from "./token"
import type {
	ConcurrencyOptions,
	Middleware,
	ProgramValuesTuple,
	RunOptions,
	TryOptions,
	UnionProgramErrors,
	UnionProgramRequirements,
	UnionProgramValues,
	UnwrapError,
	UnwrapRequirements,
	UnwrapValue,
} from "./types"

/**
 * Shell for declaring requirements and creating and running programs.
 *
 * @typeParam R - Union of tokens required by programs created from this shell
 *
 * @example
 * ```ts
 * const shell = x.require(AuthService, UserService)
 * const program = shell.try((ctx) => {
 *   const auth = ctx.get(AuthService)
 *   const user = ctx.get(UserService)
 *   return auth.authenticate(user)
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
	 * Create a `Shell` with required tokens.
	 * Returns a new `Shell` with the combined requirements.
	 * These must be provided before the program can be run.
	 *
	 * @example
	 * ```ts
	 * // Create a shell with one or more required tokens
	 * const userShell = x.require(AuthService, UserService)
	 * // userShell: Shell<AuthService | UserService>
	 *
	 * // Extend an existing shell with additional requirements
	 * const appShell = userShell.require(DatabaseService)
	 * // appShell: Shell<AuthService | UserService | DatabaseService>
	 * ```
	 */
	require<T extends TokenClass[]>(
		..._tokens: T
	): Shell<R | TokenType<T[number]>> {
		throw new Error("Shell.require not implemented")
	}

	/**
	 * Create a `Provider` for a token.
	 * Returns a new `Provider` that can supply the token to programs.
	 *
	 * @example
	 * ```ts
	 * // Create a provider with a static value
	 * const provider = x.provide(EnvService, {
	 *   DATABASE_URL: "postgres://...",
	 * })
	 * // provider: Provider<EnvService>
	 *
	 * // Extend a provider with a factory that accesses previous tokens
	 * const extended = provider.provide(DatabaseService, (ctx) => ({
	 *   connection: connect(ctx.get(EnvService).DATABASE_URL),
	 * }))
	 * // extended: Provider<EnvService | DatabaseService>
	 * ```
	 */
	provide<T extends TokenClass>(
		_token: T,
		_factory: TokenFactory<never, T>,
	): Provider<TokenType<T>> {
		throw new Error("Shell.provide not implemented")
	}

	/**
	 * Create a `Program` from a synchronous value, `Promise`, or `Program`.
	 * Thrown exceptions can be caught and transformed into typed errors.
	 * Required tokens can be accessed via the callback's context argument.
	 *
	 * @example
	 * ```ts
	 * // Wrap a synchronous value
	 * const simple = x.try(() => "hello")
	 * // simple: Program<string, never, never>
	 *
	 * // Wrap a Promise with error handling
	 * const fetchUser = x.try({
	 *   try: ({ signal }) => fetch("/api/user", { signal }).then((r) => r.json()),
	 *   catch: (error) => new FetchUserError({ cause: error }),
	 * })
	 * // fetchUser: Program<User, FetchUserError, never>
	 *
	 * // Access required tokens via context
	 * const fetchUserProfile = x.require(UserService).try((ctx) => {
	 *   const user = ctx.get(UserService)
	 *   return user.id
	 *     ? fetchProfile(user.id) // Program<UserProfile, never, never>
	 *     : x.fail(new NotFoundError()) // Program<never, NotFoundError, never>
	 * })
	 * // fetchUserProfile: Program<UserProfile, NotFoundError, UserService>
	 * ```
	 */
	try<T>(
		_fn: (context: Context<R>) => T,
	): Program<UnwrapValue<T>, UnwrapError<T>, R | UnwrapRequirements<T>>

	try<T, E>(
		_options: TryOptions<T, E, R>,
	): Program<UnwrapValue<T>, E | UnwrapError<T>, R | UnwrapRequirements<T>>

	try<T, E>(
		_fnOrOptions: ((context: Context<R>) => T) | TryOptions<T, E, R>,
	): Program<UnwrapValue<T>, E | UnwrapError<T>, R | UnwrapRequirements<T>> {
		throw new Error("Shell.try not implemented")
	}

	/**
	 * Create a program that immediately fails with the given error.
	 *
	 * @example
	 * ```ts
	 * const prog = x.fail(new NotFoundError())
	 * // prog: Program<never, NotFoundError, never>
	 *
	 * // Use in then/catch for branching
	 * prog.then((v) => v > 0 ? v : x.fail(new NegativeError()))
	 * ```
	 */
	fail<E>(_error: E): Program<never, E, never> {
		throw new Error("Shell.fail not implemented")
	}

	/**
	 * Combine multiple programs, running them all and collecting results.
	 * Returns a tuple of values in the same order as the input programs.
	 */
	all<const T extends readonly Program[]>(
		_programs: T,
		_options?: ConcurrencyOptions,
	): Program<
		ProgramValuesTuple<T>,
		UnionProgramErrors<T>,
		R | UnionProgramRequirements<T>
	> {
		throw new Error("Shell.all not implemented")
	}

	/**
	 * Run multiple programs, returning the first success.
	 */
	any<const T extends readonly Program[]>(
		_programs: T,
	): Program<
		UnionProgramValues<T>,
		UnionProgramErrors<T>,
		R | UnionProgramRequirements<T>
	> {
		throw new Error("Shell.any not implemented")
	}

	/**
	 * Run multiple programs, returning the first to complete.
	 */
	race<const T extends readonly Program[]>(
		_programs: T,
	): Program<
		UnionProgramValues<T>,
		UnionProgramErrors<T>,
		R | UnionProgramRequirements<T>
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
