import type { NamedClass } from "./classes"
import type { Program } from "./program"
import type { Result } from "./result"
import type {
	ConcurrencyOptions,
	ExtractProgramTupleErrors,
	ExtractProgramTupleRequirements,
	ExtractProgramTupleValues,
	Middleware,
	ProgramContext,
	ProgramValuesTuple,
	RunOptions,
} from "./types"

export class Shell<C = never, R = never> {
	use(_middleware: Middleware<C>): Shell<C, R> {
		throw new Error("ProgramBuilder.use not implemented")
	}

	// ───────────────────────────────────────────────────────────────────────────
	// DEPENDENCY INJECTION
	// ───────────────────────────────────────────────────────────────────────────

	require<S extends ReturnType<typeof NamedClass>>(
		_service: S,
	): Shell<C | S, R | S> {
		throw new Error("ProgramBuilder.require not implemented")
	}

	provide<S extends R>(
		_service: S,
		_implementation: S,
	): Shell<C, Exclude<R, S>> {
		throw new Error("ProgramBuilder.provide not implemented")
	}

	// ───────────────────────────────────────────────────────────────────────────
	// CREATION
	// ───────────────────────────────────────────────────────────────────────────

	try<T, E = unknown, F = never>(
		_fn: (context: ProgramContext<C>) => T | Promise<T> | Program<T, E, R>,
		_catch?: (error: E) => F,
	): Program<T, F, R> {
		throw new Error("ProgramBuilder.try not implemented")
	}

	fail<E>(_error: E): Program<never, E, R> {
		throw new Error("ProgramBuilder.fail not implemented")
	}

	// ───────────────────────────────────────────────────────────────────────────
	// COMBINATORS
	// ───────────────────────────────────────────────────────────────────────────

	all<T extends readonly Program[]>(
		_programs: T,
		_options?: ConcurrencyOptions,
	): Program<
		ProgramValuesTuple<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("ProgramBuilder.all not implemented")
	}

	any<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("ProgramBuilder.any not implemented")
	}

	race<T extends readonly Program[]>(
		_programs: T,
	): Program<
		ExtractProgramTupleValues<T>,
		ExtractProgramTupleErrors<T>,
		R | ExtractProgramTupleRequirements<T>
	> {
		throw new Error("ProgramBuilder.race not implemented")
	}

	// ───────────────────────────────────────────────────────────────────────────
	// EXECUTION
	// ───────────────────────────────────────────────────────────────────────────

	run<T, E, Options extends RunOptions>(
		_program: Program<T, E, never>,
		_options?: Options,
	): Options["mode"] extends "unwrap" ? Promise<T> : Promise<Result<T, E>> {
		throw new Error("Program.run not implemented")
	}
}
