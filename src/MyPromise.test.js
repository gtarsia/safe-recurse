import test from 'ava'
import MyPromise from './MyPromise'

test('MyPromise should work correctly', async (t) => {
  const p = new MyPromise()
  const result = 1
  p.resolve(result)
  t.deepEqual(await p, result)
})
