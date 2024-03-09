import type { ESLint, Linter } from "eslint";
import { version } from "../package.json";

const plugin = {
  meta: {
    name: "overdrive",
    version,
  },
  rules: {

  },
} satisfies ESLint.Plugin;

type RuleDefinitions = typeof plugin["rules"];

export type RuleOptions = {
  [K in keyof RuleDefinitions]: RuleDefinitions[K]["defaultOptions"]
};

export type Rules = {
  [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
};

export default plugin;
