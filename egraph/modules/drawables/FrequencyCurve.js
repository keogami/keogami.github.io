import { Drawable } from "./Drawable.js"

const _scale = (vec, scale) => {
  return {
    x: vec.x * scale, y: vec.y * scale,
  }
}

const _add = (vec1, vec2) => {
  return {
    x: vec1.x + vec2.x, y: vec1.y + vec2.y,
  }
}

const _diff = (vec1, vec2) => {
  return _add(vec1, _scale(vec2, -1))
}

const _abs = (vec) => {
  return {
    x: Math.abs(vec.x), y: Math.abs(vec.y)
  }
}

const _hypot = (vec) => Math.hypot(vec.x, vec.y)

const _createControlPathWithSmoothing = (smoothness = 1.0) => ({ from, knot, to }) => {
  const fkDist = _hypot(_diff(from, knot))
  const tkDist = _hypot(_diff(knot, to))
  
  const scale = {
    from: (fkDist / (fkDist + tkDist)) * smoothness,
    to: (tkDist / (fkDist + tkDist)) * smoothness,
  }

  const ftDiff = _diff(to, from)

  const path =  {
    from: _diff(knot, _scale(ftDiff, scale.from)),
    to: _add(knot, _scale(ftDiff, scale.to)),
  }

  return path
}

const _createControlPoints = (smoothness = 1.0) => points => {
  if (points.length < 3) {
    const hint = `provided (points.length = ${points.length})`
    throw new Error(`_controlPoints requires at least three points, HINT: ${hint}`)
  }
  const createPath = _createControlPathWithSmoothing(smoothness)
  const controlPoints = []

  for (let i = 0; (i + 2) < points.length; i++) {
    const ps = {
      from: points[i + 0],
      knot: points[i + 1],
      to  : points[i + 2],
    }
    const cp = createPath(ps)
    controlPoints.push(cp.from, cp.to)
  }

  return controlPoints
}

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

const _drawSpline = (smoothness = 0.5) => (ctx, points) => {
  const cps = _createControlPoints(smoothness)(points)

  ctx.beginPath()

  ctx.moveTo(points[0].x, points[0].y)
  ctx.quadraticCurveTo(cps[0].x, cps[0].y, points[1].x, points[1].y)

  ctx.stroke()
  ctx.closePath()

  for (let i = 1; i < points.length - 2; i++) {
    const cpIndex = (2 * i) - 1
    const cp1 = cps[cpIndex], cp2 = cps[cpIndex + 1]
    const p = points[i]
    const next = points[i + 1]
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.x, next.y)
    ctx.stroke()
    ctx.closePath()
  }

  const lastCp = cps[cps.length - 1]
  const lastPoint = points[points.length - 1]
  const secondLastPoint = points[points.length - 2]

  ctx.beginPath()

  ctx.moveTo(secondLastPoint.x, secondLastPoint.y)
  ctx.quadraticCurveTo(lastCp.x, lastCp.y, lastPoint.x, lastPoint.y)

  ctx.stroke()
  ctx.closePath()
  
}

const adjustWithOrigin = (origin) => (point) => {
  return {
    x: origin.x + point.x,
    y: origin.y - point.y,
  }
}


class FrequencyCurve extends Drawable {
  constructor() {
    super()
    this._smoothness = 0.3
  }

  Smoothness(val) {
    this._smoothness = val
    return this
  }

  DrawOn(chart) {
    const { context: ctx, origin: o } = chart
    const { _for: table, _fixtures: f } = this
    const adjust = adjustWithOrigin(o)
    const points = [...generatePoints({ table, fixtures: f })].map(adjust)

    ctx.save()
    ctx.fillStyle = ctx.strokeStyle = this._color
    ctx.lineWidth = 2
    
    _drawSpline(this._smoothness)(ctx, points)

    ctx.restore()
  }
}

export { FrequencyCurve }