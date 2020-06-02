import MyPromise from './MyPromise'

function keyFromArg(arg1) {
  return JSON.stringify(arg1)
}

export default function safeRecurse(fn) {
  const results = {}
  const invoked = {}
  const args = []
  function getResultsPromise(arg1) {
    const key = keyFromArg(arg1)
    if (!results[key]) {
      results[key] = new MyPromise()
    }
    return results[key]
  }
  async function run(arg1) {
    args.push(arg1)
    while (args.length > 0) {
      const arg = args.pop()
      const key = keyFromArg(arg)
      if (!invoked[key]) {
        fn(arg)
        invoked[key] = true
      }
    }
    return getResultsPromise(arg1)
  }
  function request(deps) {
    args.push(...deps)
    return Promise.all(deps.map(getResultsPromise))
  }
  function resolve(arg1, value) {
    const promise = getResultsPromise(arg1)
    promise.resolve(value)
    return promise
  }
  return { run, request, resolve }
}
