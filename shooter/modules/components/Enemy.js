import { Vector2 } from "../System.js"

class Enemy {
  constructor(coord, color, size, velocity, compSet) {
    this.coord = coord.Clone()
    this.color = color
    this.size = size
    this.velocity = velocity
    this._compSet = compSet
  }

  Hit() {
    this._compSet.Remove(this)
  }

  Update({ screen }) {
    this.velocity = Vector2.Slope(this.coord, screen.GetComponent("player").coord).Scale(5)
    this.coord.Add(this.velocity)
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

export { Enemy }