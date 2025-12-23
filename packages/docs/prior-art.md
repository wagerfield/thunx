# Prior Art

Thunx stands on the shoulders of giants. This document acknowledges the libraries, languages, and ideas that inspired its design.

---

## Effect

[Effect](https://effect.website/) is a powerful TypeScript library for building type-safe, composable applications. It deeply influenced Thunx in several ways:

### The Three-Channel Type

Effect's `Effect<A, E, R>` type tracks success `A`, errors `E`, and requirements `R` in a single type signature.

Thunx mirrors this design with `Thunk<T, E, R>`:

```typescript
// effect
Effect<User, FetchError, UserService>

// thunx
Thunk<User, FetchError, UserService>
```

### Tagged Errors

Effect provides `Data.TaggedError` for creating errors with a typed `_tag` discriminator for pattern matching.

Thunx follows a similar approach, but leverages and overrides `Error.name` instead:

```typescript
// effect
class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly resource: string
}> {}
new NotFoundError({ resource: "user" })._tag // "NotFoundError"

// thunx
class NotFoundError extends TypedError("NotFoundError")<{
  readonly resource: string
}> {}
new NotFoundError({ resource: "user" }).name // "NotFoundError"
NotFoundError.name // "NotFoundError"
```

### Context and Services

Effect's `Context.Tag` defines injectable services that can be provided at runtime. Thunx's `Token` serves the same purpose:

```typescript
// effect
class UserService extends Context.Tag("UserService")<
  UserService,
  { getUser: (id: string) => Effect<User, FetchError> }
>() {}

// thunx
class UserService extends Token("UserService") {
  declare readonly getUser: (id: string) => Thunk<User, FetchError>
}
```

### Effects as Thunks

Effect embraces the functional programming concept that effects are _thunks_ — deferred computations represented as functions.

Thunx makes this explicit in its name and core abstraction.

---

## NeverThrow

[NeverThrow](https://github.com/supermacro/neverthrow) brings Rust-style `Result` types to TypeScript, enabling type-safe error handling without exceptions.

### The Result Type

NeverThrow's `Result<T, E>` type represents either success or failure:

```typescript
// neverthrow
type Result<T, E> = Ok<T> | Err<E>

// thunx (returned from Thunk.run)
type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }
```

### Errors as Values

Both libraries share the philosophy that errors should be _values_, not exceptions. This makes error handling explicit, composable, and type-safe. The `Result` pattern traces back to languages like Rust (`Result<T, E>`), Haskell (`Either a b`), and OCaml (`result`). Effect also provides this functionality with its `Exit` and `Either` types.

---

## Promise

The native `Promise` API provides a familiar, widely-understood interface for async programming. Thunx intentionally mirrors its API to minimize the learning curve and keep the API surface small.

### Method Naming

Thunx adopts Promise's method names for familiarity:

| Promise             | Thunx          |
| ------------------- | -------------- |
| `Promise.resolve()` | `Thunk.from()` |
| `Promise.try()`     | `Thunk.try()`  |
| `Promise.all()`     | `Thunk.all()`  |
| `Promise.any()`     | `Thunk.any()`  |
| `Promise.race()`    | `Thunk.race()` |
| `.then()`           | `.then()`      |
| `.catch()`          | `.catch()`     |
| `.finally()`        | `.finally()`   |

### Polymorphic Unwrapping

Promises elegantly unify sync and async values — `Promise.resolve()` accepts values, promises, or thenables and normalizes them. Thunx extends this polymorphism to accept Thunks, merging all 3 channels (`T`, `E`, `R`):

```typescript
// Promise — unifies sync/async
Promise.resolve(value) // T → Promise<T>
Promise.resolve(promise) // Promise<T> → Promise<T>

// thunx — unifies sync/async AND tracks errors/requirements
Thunk.from(value) // T → Thunk<T, never, never>
Thunk.from(promise) // Promise<T> → Thunk<T, never, never>
Thunk.from(thunk) // Thunk<T, E, R> → Thunk<T, E, R>
```

### Lazy vs Eager

Promises execute eagerly. Thunks are lazy — deferring computation until `Thunk.run(thunk)` is called. This enables retries, observability, and composition.

---

## Zod

[Zod](https://zod.dev/) is a TypeScript-first schema validation library known for its excellent developer experience and discoverable API.

### Immutable Builder Pattern

Zod exemplifies a chainable, immutable API where each method returns a new instance:

```typescript
// zod
const schema = z.string().min(1).max(100).optional()

// thunx
const thunk = fetchUser(id)
  .timeout(5000)
  .retry(3)
  .catch(() => null)
```

Each call creates a new, independent instance — previous values are never mutated.

### Type Inference

Zod demonstrates how TypeScript can infer complex types from runtime code. Thunx follows this principle — types flow naturally from usage without manual annotation.

---

## Summary

| Concept                         | Inspiration               |
| ------------------------------- | ------------------------- |
| Three-channel type `<T, E, R>`  | Effect                    |
| Tagged/typed errors             | Effect                    |
| Dependency injection via tokens | Effect                    |
| Effects as thunks (lazy)        | Effect, general FP        |
| Result type for outcomes        | NeverThrow, Rust, Haskell |
| Errors as values                | NeverThrow, general FP    |
| Familiar method names           | Promise                   |
| Polymorphic unwrapping          | Promise                   |
| Immutable builder pattern       | Zod                       |
| Type inference from usage       | Zod, TypeScript ecosystem |

Thunx aims to combine these ideas into a cohesive, minimal library that feels familiar to TypeScript developers while providing the type-safety and composability of more sophisticated effect systems.
