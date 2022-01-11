class State {
  constructor(initial, transitions) {
    const allowed = new Map()
    for (let [from, to] of transitions) {
      if (allowed.has(from)) {
        allowed.get(from).add(to)
        continue
      }
      allowed.set(from, new Set([to]))
    }
    if (!allowed.has(initial)) {
      throw new Error("State: The initial state is not found in known state transitions")
    }
    this._allowed = allowed
    this._current = initial
  }

  Shift(to) {
    if (this._current === to) {
      return true
    }
    if (!this._allowed.get(this._current).has(to)) {
      return false
    }
    this._current = to
    return true
  }

  Is(target) {
    return this._current === target
  }
}

export { State }