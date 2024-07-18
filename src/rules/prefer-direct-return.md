# Prefer Direct Return

This ESLint rule enforces the use of direct return in functions. Instead of creating a new variable just to return it, this rule encourages you to return the expression directly. This leads to more concise and readable code. Note that this rule only applies when the variable is immediately returned after being assigned a value.

## 💡 Examples

```js
// ❌ Incorrect
function square(n) {
  const result = n * n;
  return result;
}
```

```js
// ✅ Correct
function square(n) {
  return n * n;
}
```
