class Interval {
  constructor(lower, upper) {
    this.lower = lower
    this.upper = upper
  }

  get size() {
    return this.upper - this.lower
  }

  Accepts(val) {
    return (val >= this.lower) && (val < this.upper)
  }
}

export { Interval }