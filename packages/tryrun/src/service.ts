export interface ServiceOptions {
	repeat?: number
}

export class Service {
	constructor(readonly options: ServiceOptions) {}
}
