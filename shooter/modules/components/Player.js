import { Coord } from "../System.js"

class Player {
  constructor(coord, size, color, velocity) {
    this.coord = new Coord(coord.x, coord.y)
    this.size = size
    this.color = color
    this.velocity = velocity
  }

  Update(data) {
    const keys = data.keys
    if (keys.up) {
      this.coord.y -= this.velocity.y
    } else if (keys.down) {
      this.coord.y += this.velocity.y
    }

    if (keys.right) {
      this.coord.x += this.velocity.x
    } else if (keys.left) {
      this.coord.x -= this.velocity.x
    }
  }

  Draw(screen) {
    const ctx = screen.ctx
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.shadowBlur = 6
    ctx.shadowColor = "#af1313"
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}

export { Player }