class Histogram {
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
    const { context: ctx, origin: o } = chart
    const { _fixtures: { x: fx, y: fy } } = this

    ctx.save()
    ctx.fillStyle = this._color

    let x = o.x + fx
    for (let cl of this._for.Classes()) {
      const val = (cl.length * fy)
      const y = o.y - val

      ctx.beginPath()
      ctx.rect(x, y, fx, val)
      ctx.fill()
      ctx.closePath()

      x += fx
    }

    ctx.restore()
  }
}

export { Histogram }