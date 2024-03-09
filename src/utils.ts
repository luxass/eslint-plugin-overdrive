import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator((ruleName) => `https://github.com/luxass/eslint-plugin-overdrive/blob/main/src/rules/${ruleName}.md`);

export type { ESLintUtils };
