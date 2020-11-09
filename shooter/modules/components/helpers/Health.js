class Health {
  constructor(max) {
    this._max = max
    this._current = max
  }

  get value() {
    return this._current / this._max
  }

  set value(val) {
    this._current = this._max * val
  }

  Add(delta) {
    this._current = Math.min(this._max, Math.max(0, this._current + delta))
    return this
  }
}

export { Health }