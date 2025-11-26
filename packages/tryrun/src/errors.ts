import { NamedError } from "./classes"

// Failed

export class Failed extends NamedError("Failed") {}

export const fail = (): never => {
	throw new Failed()
}

// Defect

export class Defect extends NamedError("Defect") {}

export const defect = (error?: unknown): never => {
	if (error instanceof Error) {
		const { message, cause } = error

		throw new Defect(message, { cause })
	}

	throw new Defect("Unexpected error", { cause: error })
}
