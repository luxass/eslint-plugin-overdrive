import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'
import { unindent as $ } from 'eslint-vitest-rule-tester'
import noSmallSwitch, { RULE_NAME } from './no-small-switch'
import { test } from './_test'

const valids: ValidTestCase[] = [
  {
    description: 'using default options',
    code: $`
      switch (a) {
        case 1:
        case 2:
          break;
        default:
          doSomething();
          break;
      }
    `,
  },
  {
    description: 'with options (minimumCases: 3)',
    code: $`
      switch (a) {
        case 1:
        case 2:
          break;
        case 3:
          break;
        default:
          doSomething();
          break;
      }
    `,
    options: [{
      minimumCases: 3,
    }],
  },
]

const invalids: InvalidTestCase[] = [
  {
    description: 'using default options',
    code: $`
      switch (a) {
        case 1:
          doSomething();
          break;
        default:
          doSomething();
      }
    `,
    errors: [{ messageId: 'noSmallSwitch' }],
  },
  {
    description: 'set max cases to 6',
    code: $`
      switch (a) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
    `,
    options: [{
      minimumCases: 6,
    }],
    errors: [{ messageId: 'noSmallSwitch' }],
  },
]

test({
  name: RULE_NAME,
  rule: noSmallSwitch,
  valid: valids,
  invalid: invalids,
})
