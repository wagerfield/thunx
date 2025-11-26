import type { AnyService, RetryPolicy } from "./types"

export class Program<T = unknown, E = unknown, R = unknown> {
	private constructor() {}

	// ───────────────────────────────────────────────────────────────────────────
	// DEPENDENCY INJECTION
	// ───────────────────────────────────────────────────────────────────────────

	provide<S extends AnyService>(
		_service: S,
		_implementation: S,
	): Program<T, E, Exclude<R, S>> {
		throw new Error("Program.provide not implemented")
	}

	// ───────────────────────────────────────────────────────────────────────────
	// TRANSFORMATION
	// ───────────────────────────────────────────────────────────────────────────

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

	// ───────────────────────────────────────────────────────────────────────────
	// RECOVERY
	// ───────────────────────────────────────────────────────────────────────────

	retry(_policy: RetryPolicy | number): Program<T, E, R> {
		throw new Error("Program.retry not implemented")
	}

	timeout<F = E>(_ms: number, _onTimeout?: () => F): Program<T, E | F, R> {
		throw new Error("Program.timeout not implemented")
	}

	orElse<U, F, R2 = never>(
		_fn: (error: E) => Program<U, F, R2>,
	): Program<T | U, F, R | R2> {
		throw new Error("Program.orElse not implemented")
	}
}
