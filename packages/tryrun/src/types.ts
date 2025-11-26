import type { Program } from "./program"
import type { Result } from "./result"

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

export type AnyService = {
	readonly name: string
}

export type RetryPolicy = {
	times?: number
	delay?: number | ((attempt: number) => number)
	while?: (error: unknown) => boolean
}

export type ConcurrencyOptions = {
	concurrency?: number
}

export type ProgramContext<C> = {
	signal: AbortSignal
	context: C
}

export type Middleware<C> = (
	context: ProgramContext<C> & { next: () => Promise<unknown> },
) => Promise<unknown>

export type RunMode = "result" | "unwrap"

export type RunOptions = {
	signal?: AbortSignal
	mode?: RunMode
}

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAM TYPE UTILS
// ═════════════════════════════════════════════════════════════════════════════

export type ExtractProgramTypes<P> = P extends Program<
	infer T,
	infer E,
	infer R
>
	? [T, E, R]
	: never

export type ExtractProgramValues<P> = ExtractProgramTypes<P>[0]

export type ExtractProgramErrors<P> = ExtractProgramTypes<P>[1]

export type ExtractProgramRequirements<P> = ExtractProgramTypes<P>[2]

export type ExtractProgramResult<P> = P extends Program<
	infer T,
	infer E,
	unknown
>
	? Result<T, E>
	: never

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAM TUPLE UTILS
// ═════════════════════════════════════════════════════════════════════════════

export type ExtractProgramTupleTypes<T extends readonly Program[]> =
	T[number] extends Program<infer T, infer E, infer R> ? [T, E, R] : never

export type ExtractProgramTupleValues<T extends readonly Program[]> =
	ExtractProgramTupleTypes<T>[0]

export type ExtractProgramTupleErrors<T extends readonly Program[]> =
	ExtractProgramTupleTypes<T>[1]

export type ExtractProgramTupleRequirements<T extends readonly Program[]> =
	ExtractProgramTupleTypes<T>[2]

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAM TUPLE TYPES
// ═════════════════════════════════════════════════════════════════════════════

export type ProgramValuesTuple<T extends readonly Program[]> = {
	-readonly [P in keyof T]: ExtractProgramValues<T[P]>
}

export type ProgramResultTuple<T extends readonly Program[]> = {
	-readonly [P in keyof T]: ExtractProgramResult<T[P]>
}
