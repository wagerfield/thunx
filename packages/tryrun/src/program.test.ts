import { expect, test } from "vitest"
import { x } from "./program"

test("x is defined", () => {
	expect(x).toBeDefined()
})
