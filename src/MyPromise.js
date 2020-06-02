
export default class MyPromise extends Promise {
  constructor(fn = () => {}) {
    let res = null
    super((resolve, reject) => {
      res = resolve
      fn(resolve, reject)
    })
    this.__res = res
    this.finished = false
  }

  resolve(a) {
    if (this.finished) {
      console.log('tried to resolve already running function')
    }
    this.__res(a)
    this.finished = true
    return this
  }
}
