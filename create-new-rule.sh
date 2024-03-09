#!/bin/bash

to_pascal_case() {
  local input="$1"
  # Convert input to lower case and replace spaces, underscores, and hyphens with newline
  local pascal_case="$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed -e 's/[_ -]/\n/g')"
  # Capitalize each word
  pascal_case="$(echo "$pascal_case" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')"
  # Concatenate words without spaces
  echo "$pascal_case" | tr -d '\n'
}

to_kebab_case() {
  local input="$1"
  # Convert input to lower case and replace spaces and underscores with hyphens
  local kebab_case="$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed -e 's/[ _]/-/g')"
  # Remove consecutive hyphens
  kebab_case="$(echo "$kebab_case" | sed -e 's/-\{2,\}/-/g')"
  # Remove leading and trailing hyphens
  kebab_case="$(echo "$kebab_case" | sed -e 's/^-//;s/-$//')"
  echo "$kebab_case"
}

to_camel_case() {
    local str="$1"
    local camel=""
    local capitalize_next=false

    for (( i=0; i<${#str}; i++ )); do
        local char="${str:i:1}"

        if [ "$char" == "-" ]; then
            capitalize_next=true
        elif [ "$capitalize_next" == true ]; then
            camel+="$(tr '[:lower:]' '[:upper:]' <<< "${char}")"
            capitalize_next=false
        else
            camel+="$char"
        fi
    done

    echo "$camel"
}

# Check if file exists
file_exists() {
  [ -f "$1" ] && return 0 || return 1
}

# Get rule name
echo "Enter rule name:"
read RULE_NAME

# Convert to snake-case
RULE_NAME=$(to_kebab_case "$RULE_NAME")

# Check if file already exists
if file_exists "src/rules/${RULE_NAME}.ts"; then
  echo "File already exists."
  exit 1
fi

# Create files
touch "src/rules/${RULE_NAME}.ts"
touch "src/rules/${RULE_NAME}.test.ts"
touch "src/rules/${RULE_NAME}.md"

PASCAL_RULE_NAME=$(to_pascal_case "$RULE_NAME")
CAMEL_RULE_NAME=$(to_camel_case "$RULE_NAME")

# Write template to file
cat << EOF > "src/rules/${RULE_NAME}.ts"
import type { RuleListener, RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { createRule } from "../utils";

export interface ${PASCAL_RULE_NAME}Options {
  // add options here
}

export const RULE_NAME = "${RULE_NAME}";
export type MessageIds = "";

export const ${CAMEL_RULE_NAME} = createRule<[${PASCAL_RULE_NAME}Options], MessageIds>({
  name: RULE_NAME,
  create(context) {
    return {};
  },
  meta: {
    docs: {
      description: "",
      category: "",
      recommended: "",
    },
    messages: {
      // add the messages here
    },
    schema: [
      // add the schema here
    ],
    type: ""
  },
});
EOF

cat << EOF > "src/rules/${RULE_NAME}.test.ts"
import { RuleTester } from "@typescript-eslint/rule-tester";
import { RULE_NAME, ${CAMEL_RULE_NAME} } from "./${RULE_NAME}";

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

tester.run(RULE_NAME, ${CAMEL_RULE_NAME}, {
  valid: [
    // add valid test cases here
  ],
  invalid: [
    // add invalid test cases here
  ],
});

EOF

RULE_NAME_WITH_SPACES=$(echo "${PASCAL_RULE_NAME}" | sed -r 's/(?<=[a-z])([A-Z])/ \1/g')

cat << EOF > "src/rules/${RULE_NAME}.md"
# ${RULE_NAME_WITH_SPACES}

This ESLint rule ...

## 💡 Examples

\`\`\`js
// ❌ Incorrect

\`\`\`

\`\`\`js
// ✅ Correct

\`\`\`
EOF
