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

  Draw(screen) {
    const { ctx } = screen
    const p = screen.GetComponent("player")

    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = this.size / 4
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.setLineDash([10, 3, 5, 3])
    ctx.moveTo(p.coord.x, p.coord.y)
    ctx.lineTo(this.coord.x, this.coord.y)
    ctx.stroke()
    ctx.restore()
  }
}

export { Reticle }