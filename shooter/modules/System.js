class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  Add(v2) {
    this.x += v2.x
    this.y += v2.y
  }
}

class Coord extends Vector2 {
  constructor(x, y) {
    super(x, y)
  }
}

class InfoDict {
  constructor() {
    this._map = new Map()
  }

  Set(key, value) {
    this._map.set(key, value)
    return this
  }

  String(del) {
    let out = ""
    for (let [key, value] of this._map) {
      out += (out === "") ? "" : del
      out += `${key}: ${value}`
    }
    return out
  }
}

class Time {
  constructor(stamp) {
    this.value = stamp
  }
  static Now() {
    return new Time(Date.now())
  }
  static Since(t) {
    return new Time(Date.now() - t.value)
  }
}

export { Vector2, Coord, InfoDict, Time }