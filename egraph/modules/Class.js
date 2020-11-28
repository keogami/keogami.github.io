import { Interval } from './Interval.js'

class Class extends Interval {
  constructor(lower, upper) {
    super(lower, upper)
    this.box = []
  }

  Record(val) {
    if (!this.Accepts(val)) {
      return false
    }
    this.box.push(val)
    return true
  }

  get length() {
    return this.box.length
  }
}

export { Class }