import type { TSESTree } from "@typescript-eslint/utils";
import {
  getDeclaredVariable,
  getDeclaredVariables,
  getReturnedVariable,
} from "@luxass/eslint-utils/variables";
import { isReturnStatement } from "@luxass/eslint-utils/predicates";
import { createEslintRule } from "../utils";

export type Options = [];

export const RULE_NAME = "prefer-direct-return";
export type MessageIds = "preferDirectReturn";

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Local variables should not be declared and then immediately returned or thrown",
      recommended: "recommended",
    },
    messages: {
      preferDirectReturn:
        "Consider using {{action}} directly instead of assigning it to the temporary variable \"{{variable}}\".",
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create(context) {
    function process(node: TSESTree.Node, statements: TSESTree.Statement[]) {
      if (statements.length < 2) {
        return;
      }

      const last = statements.at(-1);
      const secondLast = statements.at(-2);
      if (!last || !secondLast) {
        throw new Error("unexpected empty array");
      }
      const returnedIdentifier = getReturnedVariable(last);

      const declaredIdentifier = getDeclaredVariable(secondLast);

      if (returnedIdentifier && declaredIdentifier) {
        const scope = context.sourceCode.getScope(node);

        const sameVariable = getDeclaredVariables(scope).find((variable) => {
          return (
            variable.references.some(
              (ref) => ref.identifier === returnedIdentifier,
            )
            && variable.references.some(
              (ref) => ref.identifier === declaredIdentifier.id,
            )
          );
        });

        // there must be only one "read" - in `return` or `throw`
        if (
          sameVariable
          && sameVariable.references.filter((ref) => ref.isRead()).length === 1
        ) {
          context.report({
            messageId: "preferDirectReturn",
            data: {
              action: isReturnStatement(last) ? "return" : "throw",
              variable: returnedIdentifier.name,
            },
            node: declaredIdentifier.init!,
            fix: (fixer) => {
              const expressionText = context.sourceCode.getText(
                declaredIdentifier.init!,
              );
              const rangeToRemoveStart = secondLast.range[0];
              const commentsBetweenStatements
                = context.sourceCode.getCommentsAfter(secondLast);
              const rangeToRemoveEnd
                = commentsBetweenStatements.length > 0
                  ? commentsBetweenStatements[0].range[0]
                  : last.range[0];
              return [
                fixer.removeRange([rangeToRemoveStart, rangeToRemoveEnd]),
                fixer.replaceText(returnedIdentifier, expressionText),
              ];
            },
          });
        }
      }
    }

    return {
      BlockStatement(node) {
        process(node, node.body);
      },
      SwitchCase(node) {
        process(node, node.consequent);
      },
    };
  },
});
