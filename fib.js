async function run() {
  const safeRecurse = require('./esm')
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

  console.log(await fib(50)) // => 8
}

run()
