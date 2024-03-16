# @luxass/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Mainly for personal use, but feel free to use it if you like it.

## 📦 Install

```bash
npm install -D eslint eslint-plugin-overdrive
```

## 🚀 Usage

```js
// eslint.config.js
import pluginOverdrive from "eslint-plugin-overdrive";

export default [
  {
    plugins: {
      overdrive: pluginOverdrive
    },
    rules: {
      "overdrive/no-small-switch": "error",
    }
  }
];
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-overdrive?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/eslint-plugin-overdrive
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-overdrive?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-overdrive
