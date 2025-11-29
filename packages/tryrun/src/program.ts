import type { TokenClass, TokenShape, TokenType } from "./token"
import type { RetryPolicy } from "./types"

/**
 * A program that produces a value of type T, may fail with error E,
 * and requires token implementations R to be provided before it can run.
 *
 * @typeParam T - Success value type
 * @typeParam E - Failure error type
 * @typeParam R - Union of required token types (must be `never` to run)
 */
export class Program<out T = unknown, out E = unknown, out R = never> {
	private constructor() {}

	/**
	 * Declare tokens that the program will require.
	 * These must be provided before the program can be run.
	 */
	require<S extends TokenClass[]>(
		..._tokens: S
	): Program<T, E, R | TokenType<S[number]>> {
		throw new Error("Program.require not implemented")
	}

	/**
	 * Provide an implementation for a required token.
	 * Removes the token from the requirements.
	 */
	provide<S extends TokenClass>(
		_token: S,
		_shape: TokenShape<S>,
	): Program<T, E, Exclude<R, TokenType<S>>> {
		throw new Error("Program.provide not implemented")
	}

	map<U>(_fn: (value: T) => U): Program<U, E, R> {
		throw new Error("Program.map not implemented")
	}

	mapError<F>(_fn: (error: E) => F): Program<T, F, R> {
		throw new Error("Program.mapError not implemented")
	}

	tap(_fn: (value: T) => void | Promise<void>): Program<T, E, R> {
		throw new Error("Program.tap not implemented")
	}

	tapError(_fn: (error: E) => void | Promise<void>): Program<T, E, R> {
		throw new Error("Program.tapError not implemented")
	}

	catch<F>(_fn: (error: E) => F): Program<T, F, R> {
		throw new Error("Program.catch not implemented")
	}

	retry(_policy: RetryPolicy | number): Program<T, E, R> {
		throw new Error("Program.retry not implemented")
	}

	timeout<F = E>(_ms: number, _onTimeout?: () => F): Program<T, E | F, R> {
		throw new Error("Program.timeout not implemented")
	}

	orElse<U, F, S>(
		_fn: (error: E) => Program<U, F, S>,
	): Program<T | U, F, R | S> {
		throw new Error("Program.orElse not implemented")
	}
}
