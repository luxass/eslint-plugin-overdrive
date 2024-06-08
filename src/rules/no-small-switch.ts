import { createEslintRule } from '../utils'

export const RULE_NAME = 'no-small-switch'

export type Options = [{
  minimumCases?: number
}]

export type MessageIds = 'noSmallSwitch'

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of small switch statements',
      recommended: 'strict',
    },
    messages: {
      noSmallSwitch:
        'Your switch statement is too small. Consider using an if statement instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          minimumCases: {
            type: 'integer',
            minimum: 2,
            default: 2,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const {
      minimumCases = 2,
    } = context.options?.[0] ?? {}
    return {
      SwitchStatement(node) {
        const hasDefault = node.cases.find((c) => c.test === null)

        if (node.cases.length < minimumCases || (node.cases.length === minimumCases && hasDefault)) {
          const firstToken = context.sourceCode.getFirstToken(node)
          if (!firstToken) return

          context.report({
            node,
            messageId: 'noSmallSwitch',
            loc: firstToken.loc,
          })
        }
      },
    }
  },
})
