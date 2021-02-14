import { Drawable } from './Drawable.js'

class Histogram extends Drawable {
  constructor() {
    super()
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