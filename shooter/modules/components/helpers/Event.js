class Event {
  constructor() {
    this._map = new Map()
  }

  On(eventSym, callback) {
    if (this._map.has(eventSym)) {
      this._map.get(eventSym).add(callback)
      return
    }
    this._map.set(eventSym, new Set([callback]))
  }

  Remove(eventSym, callback) {
    if (this._map.has(eventSym)) {
      this._map.get(eventSym).delete(callback)
    }
  }

  Emit(eventSym, data) {
    if (this._map.has(eventSym)) {
      for (let fn of this._map.get(eventSym)) {
        fn(data)
      }
    }
  }
}

export { Event }