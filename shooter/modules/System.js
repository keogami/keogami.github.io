class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  Add(v2) {
    this.x += v2.x
    this.y += v2.y
    return this
  }

  Scale(by) {
    this.x *= by
    this.y *= by
    return this
  }

  Clone() {
    return new Vector2(this.x, this.y)
  }
  
  Hypot() {
    return Math.hypot(this.x, this.y)
  }

  static Slope(from, to) {
    const ang = Math.atan2(to.y - from.y, to.x - from.x)
    return new Vector2(Math.cos(ang), Math.sin(ang))
  }

  static Dist(from, to) {
    return Math.hypot(from.x - to.x, from.y - to.y)
  }
}

class Coord extends Vector2 {
  constructor(x, y) {
    super(x, y)
  }

  Clone() {
    return new Coord(this.x, this.y)
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
    return new Time(performance.now())
  }
  static Since(t) {
    return new Time(performance.now() - t.value)
  }
}

export { Vector2, Coord, InfoDict, Time }