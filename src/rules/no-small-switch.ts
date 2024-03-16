import { createEslintRule } from "../utils";

export const RULE_NAME = "no-small-switch";

export type Options = [];

export type MessageIds = "small-switch";

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow the use of small switch statements",
      recommended: "strict",
    },
    messages: {
      "small-switch": "Your switch statement is too small. Consider using an if statement instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      SwitchStatement(node) {
        const hasDefault = node.cases.find((c) => c.test === null);

        if (node.cases.length < 2 || (node.cases.length === 2 && hasDefault)) {
          const firstToken = context.sourceCode.getFirstToken(node);
          if (!firstToken) return;

          context.report({
            node,
            messageId: "small-switch",
            loc: firstToken.loc,
          });
        }
      },
    };
  },
});
