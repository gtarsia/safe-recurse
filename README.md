
# safe-recurse

A hobby non-production ready project to deal with recursion call stack limits.

## Why

The default call stack size in nodejs is around 10k calls.  
*(tested by running `(function qwe(n=0) { console.log(n++); qwe(n) })()` in node v13.14.0)*

Here, I write a call stack error safe (or safer) alternative for your recursive functions.  
Instead of getting a call stack size error, you should either get:

* A nodejs native out of memory exception
* The result of your function

For the moment, this library works **only and only** with single primitive argument functions, read the [why single primitive argument only](#why-single-primitive-argument) to understand why.

## How to use it

npm/yarn/pnpm install `safe-recurse` package.

Here's a Fibonacci number example usage:

```javascript
// fibonacci.js
const safeRecurse = require('safe-recurse')
const { run: fib, request, resolve } = safeRecurse(async (n) => {
  if (n === 0) {
    return resolve(n, 0)
  }
  if (n === 1) {
    return resolve(n, 1)
  }
  const [n1, n2] = await request([n - 1, n - 2])
  return resolve(n, n1 + n2)
})

await fib(6) // => 8
```

(You can run this example with `node fib.js`)

As shown in the code,  

When we have the result for a call without recursion, we `return resolve(argument, result)`.  
For example: `fib(1) = 1`, then we do `return resolve(1, 1)`

When we need values we would otherwise get by recursing them, we `await request(values)` instead.  
For example: `fib(2) = fib(1) + fib(0)`, then we do `await request([1, 0])` to obtain those values.

## How does this work?

### Fixing recursion

To fix the problem of stack size overflow we need to transform a programatically recursive function 
into a programatically iterated function. This iteration is done over a **recursion loop**.

While a recursive function calls itself and switches execution context before returning,
an iterative alternative keep track of arguments passed in a list,
and switches context **after** returning, when the next iteration starts and the function is called with the next argument.

This means instead of doing `f(f(f()))`, we run them serially `f()->f()->f()`.

In js, we make use of `async/await` to defer the results we haven't processed yet so that the end user code is relatively simple to write.

For the same reason, the code of this library was also relatively simple to write.

### Results promises object

When it runs, `safe-recurse` keeps an object called **results promises object**.

This object has promises of results keyed by `JSON.stringify(argument)`.

For example, for fibonacci the promise for the result of `fib(1)` is a promise
with key `'1'` in the results promises object.

This effectively creates a dependency tree between results promises,
in the same way `fib(2)` depends on `fib(1)` and `fib(0)`.

## Limitations

### Performance

Performance is not the main interest of this project, at least initially.

### No deadlocks checks

`safe-recurse` does not check for deadlocks in the recursion algorithm you pass to it, but an implementation for it could definitely be implemented.

### No `await` before calling `request` in your recursive function

`await`ing before `request` makes the `request` call to not get reached before the recursion loop iteration continues. When that happens, the iteration loop can run out of arguments to iterate next and the original promise never resolves.

It is possible for this to be implemented (note to self: by removing the `async` identifier and checking the type of Promise returned), but I don't think at this point that's really important.

### Why single primitive argument only

*(By primitive, we mean [primitive values](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) except `undefined` and `Symbol`)*

I could add support for **multiple** argument recursion functions, but I wanted to focus first on single argument first.

Implementation of **non-primitive** arguments (objects for example) is pretty hard because it's not trivial to *key* objects.  
For example, in js `{a: 3}` is not strictly equal to another object `{a: 3}`.  
If we were to `JSON.stringify` them, order of properties can ruin strict equality, for example `'{"a":3,"b":4}'` is not equal to `'{"b":4,"a":3}'`.  
So we would have ensure order of properties, and also deep check that every value is `JSON.stringify` safe.n, but even I don't think we're completely safe from any other language shenaningans.
