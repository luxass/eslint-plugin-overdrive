import tsParser from "@typescript-eslint/parser";
import type { RuleTesterInitOptions, TestCasesOptions } from "eslint-vitest-rule-tester";
import { run } from "eslint-vitest-rule-tester";

export function test(options: TestCasesOptions & RuleTesterInitOptions) {
  return run({
    parser: tsParser as any,
    ...options,
  });
}
