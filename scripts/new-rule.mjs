#!/usr/bin/env node
// @ts-check

import { existsSync, writeFileSync } from 'node:fs'
import process from 'node:process'

/**
 * @param {string} input
 * @returns {string} The input string in PascalCase
 */
function toPascalCase(input) {
  const pascalCase = input
    .toLowerCase()
    .replace(/[_ -]/g, '\n')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\n/g, '')
  return pascalCase
}

/**
 * @param {string} input
 * @returns {string} The input string in kebab-case
 */
function toKebabCase(input) {
  const kebabCase = input
    .toLowerCase()
    .replace(/[ _]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
  return kebabCase
}

/**
 * @param {string} str
 * @returns {string} The input string in camelCase
 */
function toCamelCase(str) {
  let camel = ''
  let capitalizeNext = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (char === '-') {
      capitalizeNext = true
    } else if (capitalizeNext) {
      camel += char.toUpperCase()
      capitalizeNext = false
    } else {
      camel += char
    }
  }

  return camel
}

/**
 * @param {string} input
 * @returns {string} The input string with spaces between each word
 */
function pascalToSpaced(input) {
  let output = ''
  let prevChar = ''

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (prevChar !== '' && char.match(/[A-Z]/) && prevChar.match(/[a-z]/)) {
      output += ' '
    }

    output += char
    prevChar = char
  }

  return output
}

/**
 * @param {string} kebabRuleName
 * @returns {string} The rule template
 */
function getRuleTemplate(kebabRuleName) {
  return /* typescript */`import { createEslintRule } from '../utils'

export type Options = [
  // add options here
]

export const RULE_NAME = '${kebabRuleName}'
export type MessageIds = ''

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    docs: {
      description: '',
      category: '',
      recommended: '',
    },
    messages: {
      // add the messages here
    },
    schema: [
      // add the schema here
    ],
    type: '',
  },
  defaultOptions: [],
  create(context) {
    return {}
  },
})
`
}

/**
 * @param {string} camelRuleName
 * @param {string} kebabRuleName
 * @returns {string} The test template
 */
function getTestTemplate(camelRuleName, kebabRuleName) {
  return /* typescript */`import { RuleTester } from '@typescript-eslint/rule-tester'
import ${camelRuleName}, { RULE_NAME } from './${kebabRuleName}'

const tester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

tester.run(RULE_NAME, ${camelRuleName}, {
  valid: [
    // add valid test cases here
  ],
  invalid: [
    // add invalid test cases here
  ],
})
`
}

/**
 * @param {string} ruleName
 * @returns {string} The markdown template
 */
function getMarkdownTemplate(ruleName) {
  return /* markdown */`# ${ruleName}

This ESLint rule ...

## 💡 Examples

\`\`\`js
// ❌ Incorrect

\`\`\`

\`\`\`js
// ✅ Correct

\`\`\`
`
}

/**
 * @param {string} ruleName
 */
function createRule(ruleName) {
  const kebabRuleName = toKebabCase(ruleName)
  if (existsSync(`src/rules/${kebabRuleName}.ts`)) {
    console.error(`Rule ${kebabRuleName} already exists`)
    process.exit(1)
  }

  const pascalRuleName = toPascalCase(ruleName)
  const camelRuleName = toCamelCase(ruleName)

  writeFileSync(`src/rules/${kebabRuleName}.ts`, getRuleTemplate(ruleName))
  writeFileSync(`src/rules/${kebabRuleName}.test.ts`, getTestTemplate(camelRuleName, kebabRuleName))
  writeFileSync(`src/rules/${kebabRuleName}.md`, getMarkdownTemplate(pascalToSpaced(pascalRuleName)))
}

async function run() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Please provide a rule name')
    process.exit(1)
  }

  for (const ruleName of args) {
    createRule(ruleName)
    console.log(`Rule ${ruleName} created successfully!`)
  }

  console.log('All rules created successfully!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
