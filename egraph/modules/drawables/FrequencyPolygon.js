import { Drawable } from "./Drawable.js"

const generatePoints = function* ({ table: t , fixtures: f }) {
  yield {
    x: f.x, y: 0
  }

  let x = f.x * 1.5

  for (let cl of t.Classes()) {
    yield {
      x: x, y: cl.length * f.y
    }
    x += f.x
  }

  yield {
    x: x - (f.x / 2), y: 0,
  }
}

const adjustWithOrigin = (origin) => (point) => {
  return {
    x: origin.x + point.x,
    y: origin.y - point.y,
  }
}

const _drawVector = (points, ctx) => {
  ctx.beginPath()

  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    const p = points[i]
    ctx.lineTo(p.x, p.y)
  }

  ctx.stroke()

  ctx.closePath()
}

const _drawPoints = (points, ctx, size) => {
  for (let p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }
}

class FrequencyPolygon extends Drawable {
  constructor() {
    super()
    this._dotSize = 0
  }

  DotSize(val) {
    this._dotSize = val
    return this
  }

  DrawOn(chart) {
    const { context: ctx, origin: o } = chart
    const { _for: table, _fixtures: fixtures } = this

    const adjust = adjustWithOrigin(o)
    const points = [...generatePoints({ table, fixtures })].map(adjust)

    ctx.save()
    ctx.strokeStyle = this._color
    ctx.fillStyle = this._color

    _drawVector(points, ctx)
    _drawPoints(points, ctx, this._dotSize)

    ctx.restore()
  }
}

export { FrequencyPolygon }