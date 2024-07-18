import type { ESLintUtils } from "@typescript-eslint/utils";

import { createESLintRuleBuilder } from "@luxass/eslint-utils";

export type { ESLintUtils };

export const createEslintRule = createESLintRuleBuilder(
  "https://github.com/luxass/eslint-plugin-overdrive/blob/main/src/rules/$RULE_NAME.md",
);
