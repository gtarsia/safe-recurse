import test from 'ava'
import safeRecurse from './safe-recurse'

const { run: fib, request, resolve } = safeRecurse(async (n) => {
  if (typeof n !== 'number') {
    throw new Error(`n was ${n} but should be of type Number`)
  }
  if (n === 0) {
    return resolve(n, 0)
  }
  if (n === 1) {
    return resolve(n, 1)
  }
  const results = await request([n - 1, n - 2])
  return resolve(n, results[0] + results[1])
})

test('safeRecurse should work correctly', async (t) => {
  t.deepEqual(await fib(10), 55)
})
