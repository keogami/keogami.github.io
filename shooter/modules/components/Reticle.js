class Reticle {
  constructor(coord, color, size) {
    this.coord = coord.Clone()
    this.color = color
    this.size = size
    this._currentSize = size
  }

  Update({ mouse }) {
    this.coord.x = mouse.coord.x
    this.coord.y = mouse.coord.y
  }

  Draw({ ctx }) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 5
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}

export { Reticle }