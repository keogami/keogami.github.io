const _drawMarginOn = (chart) => {
  const { context: ctx, drawableRegion: dr } = chart

  ctx.beginPath()
  ctx.moveTo(dr.x.from, dr.y.from)
  ctx.lineTo(dr.x.from, dr.y.to)
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.moveTo(dr.x.from, dr.y.from)
  ctx.lineTo(dr.x.to, dr.y.from)
  ctx.stroke()
  ctx.closePath()
}

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

const _normalize = (from, to) => {
  const diff = { x: to.x - from.x, y: to.y - from.y }
  const hypot = Math.hypot(diff.x, diff.y)
  return _scale(diff, 1 / hypot)
}

const _drawXMarkerOn = (chart, marker) => {
  const { drawableRegion: dr } = chart

  const from = { x: dr.x.from, y: dr.y.from }
  const to = { x: dr.x.to, y: dr.y.from }

  _drawMarkersOn(chart, from, to, marker)
}

const _drawYMarkerOn = (chart, marker) => {
  const { drawableRegion: dr } = chart

  const from = { x: dr.x.from, y: dr.y.from }
  const to = { x: dr.x.from, y: dr.y.to }

  _drawMarkersOn(chart, from, to, marker)
}

const _drawMarkersOn = (chart, from, to, marker) => {
  const { context: ctx } = chart

  const normal = _normalize(from, to)

  for (let i = 0; i < marker.count; i++) {
    const markerDist = i * marker.fixedAt
    const point = _add(from, _scale(normal, markerDist))

    ctx.beginPath()
    ctx.arc(point.x, point.y, marker.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()

    if (marker.HasLabels()) {
      const label = marker.labels.next().value ?? ""
      if (label === "") {
        continue
      }
      const at = marker.adjust(point, label)

      ctx.beginPath()
      ctx.textAlign = marker.align
      ctx.fillText(label, at.x, at.y)
      ctx.fill()
      ctx.closePath()
    }
  }
}

class Ruling {
  constructor() {
    this.color = 'white'
    this.forX = null
    this.forY = null
  }

  Color(val) {
    this.color = val
    return this
  }

  ForX(marker) {
    this.forX = marker
    return this
  }

  ForY(marker) {
    this.forY = marker
    return this
  }

  DrawOn(chart) {
    const { context: ctx } = chart

    ctx.save()
    ctx.font = "12px sans-serif"
    ctx.strokeStyle = ctx.fillStyle = this.color

    _drawMarginOn(chart)
    this.forX && _drawXMarkerOn(chart, this.forX)
    this.forY && _drawYMarkerOn(chart, this.forY)

    ctx.restore()
  }
}

export { Ruling }