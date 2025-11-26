export function NamedClass<Name extends string>(name: Name) {
	return class NamedClass {
		static readonly name = name
		public readonly name = name
	}
}

export function NamedError<Name extends string>(name: Name) {
	return class NamedError extends Error {
		static override readonly name = name
		public override readonly name = name
	}
}
