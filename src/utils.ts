import { ESLintUtils } from '@typescript-eslint/utils'

export type { ESLintUtils }

export const createEslintRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/luxass/eslint-plugin-overdrive/blob/main/src/rules/${ruleName}.md`,
)
