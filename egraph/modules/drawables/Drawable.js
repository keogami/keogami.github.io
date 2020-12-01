class Drawable {
  constructor() {
    this._for = null
    this._fixtures = {
      x: 0, y: 0,
    }
    this._color = 'white'
  }

  For(freqDist) {
    this._for = freqDist
    return this
  }

  Fixtures(x, y) {
    this._fixtures.x = x
    this._fixtures.y = y
    return this
  }

  Color(c) {
    this._color = c
    return this
  }

  DrawOn(chart) {
    throw new Error('DrawOn must be implemented by the derivative classes')
  }
}