// Named Error

export function NamedError<Name extends string>(name: Name) {
	return class NamedError extends Error {
		static override readonly name = name
		public override readonly name = name
	}
}

// Failed Error

export class Failed extends NamedError("Failed") {}

export const fail = (): never => {
	throw new Failed()
}

// Defect Error

export class Defect extends NamedError("Defect") {}

export const defect = (error?: unknown): never => {
	if (error instanceof Error) {
		const { message, cause } = error

		throw new Defect(message, { cause })
	}

	throw new Defect("Unexpected error", { cause: error })
}
