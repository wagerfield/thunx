# tryrun

**Type-safe, composable programs with tracked errors and dependencies.**

[![npm version](https://img.shields.io/npm/v/tryrun.svg)](https://www.npmjs.com/package/tryrun)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Overview

tryrun is a lightweight TypeScript library for building programs where **errors** and **dependencies** are tracked at the type level. No more runtime surprises.

## Features

- 🎯 **Tracked errors** — Know exactly what can fail at compile time
- 🔌 **Tracked dependencies** — Know exactly what's required to run
- 💉 **Type-safe DI** — Services resolved at runtime, verified at compile time
- 🔗 **Composable** — Chain, combine, and transform with full type inference
- 📦 **Tiny** — ~2KB minified, zero dependencies
- ⚡ **Async-first** — Seamless async/await integration

## Installation

```bash
npm install tryrun
```

## Quick Start

```typescript
import { x, Token, TypedError } from "tryrun"

// Define a service
class UserService extends Token("UserService")<{
	getUser: (id: string) => Promise<User>
}> {}

// Define an error
class NotFoundError extends TypedError("NotFound")<{
	resource: string
}> {}

// Create a program
const getUser = x.require(UserService).try(async (ctx) => {
	const user = await ctx.get(UserService).getUser("123")
	if (!user) throw new NotFoundError({ resource: "user" })
	return user
})
// Type: Program<User, NotFoundError | unknown, UserService>

// Provide dependencies and run
const result = await x.run(
	getUser.provide(x.provide(UserService, { getUser: fetchUser })),
)

if (result.isSuccess()) {
	console.log(result.value)
}
```

## Documentation

📖 [Full Documentation](https://tryrun.vercel.app)

## License

[MIT](./license) © [Matthew Wagerfield](https://github.com/wagerfield)
