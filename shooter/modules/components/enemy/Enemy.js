import { Vector2 } from "../../System.js"
import { Game } from "../../Game.js"
import { Health } from "../helpers/Health.js"
import { Event } from "../helpers/Event.js"

class Enemy {
  static EVENT_DEATH = Symbol("Death")
  constructor(coord, color, size, speed, compSet) {
    this.coord = coord.Clone()
    this.color = color
    this.size = size
    this.speed = speed
    this._compSet = compSet
    this.health = new Health(5)
    this.damage = 20
    this.score = 10

    this.events = new Event()
  }

  Hit({ damage }) {
    this.health.Add(-damage)
    if (this.health.value <= 0) {
      this._compSet.Remove(this)
      this.events.Emit(Enemy.EVENT_DEATH, this)
      return true
    }
    return false
  }

  Update({ screen, game }) {
    const p = screen.GetComponent("player")
    if (Vector2.Dist(this.coord, p.coord) <= (this.size + p.size)) {
      const killed = p.Hit(this)
      this._compSet.Remove(this)
      this.events.Emit(Enemy.EVENT_DEATH, this)
      if (killed) {
        game.state = Game.STATE_END
        return
      }
    }
    const velocity = Vector2.Slope(this.coord, p.coord).Scale(this.speed)
    this.coord.Add(velocity)
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