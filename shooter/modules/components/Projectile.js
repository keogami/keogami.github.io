class Projectile {
  constructor(coord, color, size, velocity) {
    this.coord = coord.Clone()
    this.color = color
    this.size = size
    this.velocity = velocity
  }

  Update() {
    this.coord.x += this.velocity.x
    this.coord.y += this.velocity.y
  }

  Draw({ ctx }) {
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = ctx.shadowColor = this.color
    ctx.shadowBlur = this.size / 4
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}