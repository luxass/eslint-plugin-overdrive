import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'
import { unindent as $ } from 'eslint-vitest-rule-tester'
import preferDirectReturn, { RULE_NAME } from './prefer-direct-return'
import { test } from './_test'

const valids: ValidTestCase[] = [
  {
    description: 'throw statement',
    code: $`
      function thrown_ok() {
        throw new Error();
      }
    `,
  },
  {
    description: 'throw statement with expression',
    code: $`
      function thrown_expression() {
        const x = new Error();
        throw foo(x);
      }
    `,
  },
  {
    description: 'throw statement with different variable',
    code: $`
      function thrown_different_variable(y) {
        const x = new Error();
        throw y;
      }
    `,
  },
  {
    description: 'return statement',
    code: $`
      function code_between_declaration_and_return() {
        let x = 42;
        foo();
        return x;
      }
    `,
  },
  {
    description: 'return statement with expression',
    code: $`
      function return_expression() {
        let x = 42;
        return x + 5;
      }
    `,
  },
  {
    code: $`
      function return_without_value() {
        let x = 42;
        return;
      }
    `,
  },
  {
    code: $`
      function not_return_statement() {
        let x = 42;
        foo(x);
      }
    `,
  },
  {
    code: $`
      function no_init_value() {
        let x;
        return x;
      }
    `,
  },
  {
    code: $`
      function pattern_declared() {
        let { x } = foo();
        return x;
      }
    `,
  },
  {
    code: $`
      function two_variables_declared() {
        let x = 42,
          y;
        return x;
      }
    `,
  },
  {
    code: $`
      function different_variable_returned(y) {
        let x = 42;
        return y;
      }
    `,
  },
  {
    code: $`
      function only_return() {
        return 42;
      }
    `,
  },
  {
    code: $`
      function one_statement() {
        foo();
      }
    `,
  },
  {
    code: $`
      function empty_block() {}
    `,
  },
  {
    code: $`
      let arrow_function_ok = (a, b) => {
        return a + b;
      };
    `,
  },
  {
    code: $`
      let arrow_function_no_block = (a, b) => a + b;
    `,
  },
  {
    code: $`
      function variable_has_type_annotation() {
        let foo: number = 1;
        return foo;
      }
    `,
  },
  {
    code: $`
      function variable_is_used() {
        var bar = {
          doSomethingElse(p) {},
          doSomething() {
            bar.doSomethingElse(1);
          },
        };
        return bar;
      }
    `,
  },
]

const invalids: InvalidTestCase[] = [
  {
    code: `
      function returnConstVariable() {
        const x = 42;
        return x;
      }`,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function returnConstVariable() {
        return 42;
      }`,
  },
  {
    code: `
      function returnLetVariable() {
        let x = 42;
        return x;
      }
    `,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function returnLetVariable() {
        return 42;
      }
    `,
  },
  {
    code: `
      function callFNBeforeVariableDeclaration() {
        foo();
        const x = 42;
        return x;
      }
    `,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function callFNBeforeVariableDeclaration() {
        foo();
        return 42;
      }
    `,
  },
  {
    code: `
      function throwVariable() {
        const x = new Error();
        throw x;
      }`,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function throwVariable() {
        throw new Error();
      }`,
  },
  {
    code: `
      function differentBlocks() {
        if (foo) {
          let x = foo();
          return x;
        }

        try {
          let x = foo();
          return x;
        } catch (e) {
          let x = foo();
          return x;
        } finally {
          let x = foo();
          return x;
        }
      }
    `,
    errors: [
      {
        messageId: 'preferDirectReturn',
      },
      {
        messageId: 'preferDirectReturn',
      },
      {
        messageId: 'preferDirectReturn',
      },
      {
        messageId: 'preferDirectReturn',
      },
    ],
    output: `
      function differentBlocks() {
        if (foo) {
          return foo();
        }

        try {
          return foo();
        } catch (e) {
          return foo();
        } finally {
          return foo();
        }
      }
    `,
  },
  {
    code: `
      function two_declarations(a) {
        if (a) {
          let x = foo();
          return x;
        } else {
          let x = bar();
          return x + 42;
        }
      }
    `,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function two_declarations(a) {
        if (a) {
          return foo();
        } else {
          let x = bar();
          return x + 42;
        }
      }
    `,
  },
  {
    code: `
      function homonymous_is_used() {
        const bar = {
          doSomethingElse(p) {
            var bar = 2;
            return p + bar;
          },
          doSomething() {
            return this.doSomethingElse(1);
          },
        };
        return bar;
      }
    `,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function homonymous_is_used() {
        return {
          doSomethingElse(p) {
            var bar = 2;
            return p + bar;
          },
          doSomething() {
            return this.doSomethingElse(1);
          },
        };
      }
    `,
  },
  {
    code: `
      function inside_switch(x) {
        switch (x) {
          case 1:
            const y = 3;
            return y;
          default:
            const z = 2;
            return z;
        }
      }
    `,
    errors: [
      {
        messageId: 'preferDirectReturn',
      },
      {
        messageId: 'preferDirectReturn',
      },
    ],
    output: `
      function inside_switch(x) {
        switch (x) {
          case 1:
            return 3;
          default:
            return 2;
        }
      }
    `,
  },
  {
    // hoisted variables
    code: `
    function foo() {
      if (cond) {
        var x = 42;
        return x;
      }
    }
    `,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
    function foo() {
      if (cond) {
        return 42;
      }
    }
    `,
  },
  {
    code: `
      function var_returned() {
        // comment1
        var x /* commentInTheMiddle1 */ = 42; // commentOnTheLine1
        // comment2
        return /* commentInTheMiddle2 */ x;   // commentOnTheLine2
        // comment3
      }`,
    errors: [{
      messageId: 'preferDirectReturn',
    }],
    output: `
      function var_returned() {
        // comment1
        // commentOnTheLine1
        // comment2
        return /* commentInTheMiddle2 */ 42;   // commentOnTheLine2
        // comment3
      }`,
  },
]

test({
  name: RULE_NAME,
  rule: preferDirectReturn,
  valid: valids,
  invalid: invalids,
})
