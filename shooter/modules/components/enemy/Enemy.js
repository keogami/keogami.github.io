import { Vector2 } from "../../System.js"
import { Game } from "../../Game.js"
import { Health } from "../helpers/Health.js"

class Enemy {
  constructor(coord, color, size, velocity, compSet) {
    this.coord = coord.Clone()
    this.color = color
    this.size = size
    this.velocity = velocity
    this._compSet = compSet
    this.health = new Health(5)
    this.damage = 20
    this.score = 10
  }

  Hit({ damage }) {
    this.health.Add(-damage)
    if (this.health.value <= 0) {
      this._compSet.Remove(this)
      return true
    }
    return false
  }

  Update({ screen, game }) {
    const p = screen.GetComponent("player")
    if (Vector2.Dist(this.coord, p.coord) <= (this.size + p.size)) {
      const killed = p.Hit(this)
      this._compSet.Remove(this)
      if (killed) {
        game.state = Game.STATE_END
        return
      }
    }
    this.velocity = Vector2.Slope(this.coord, p.coord).Scale(5)
    this.coord.Add(this.velocity)
  }

  Draw({ ctx }) {
    ctx.save()

    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.strokeStyle = this.color
    ctx.shadowBlur = this.size / 4
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.arc(this.coord.x, this.coord.y, this.size + 5, 0, Math.PI * 2 * this.health.value)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

    ctx.restore()
  }
}

export { Enemy }