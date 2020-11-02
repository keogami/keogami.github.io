import { Coord } from "../System.js"
import { Game } from "../Game.js"
import { Health } from "./helpers/Health.js"
import { State } from "../State.js"

const STATE_IDLE = Symbol("idle")
const STATE_MOVING = Symbol("moving")
const STATE_DRAINING = Symbol("draining")

const playerStateTransitions = [
  [STATE_IDLE, STATE_MOVING],
  [STATE_IDLE, STATE_DRAINING],
  [STATE_DRAINING, STATE_MOVING],
  [STATE_MOVING, STATE_IDLE],
]

class Player {
  constructor(coord, size, color, velocity) {
    this.coord = coord.Clone()
    this.size = size
    this.color = color
    this.velocity = velocity
    this.health = new Health(100)
    this._state = new State(STATE_IDLE, playerStateTransitions)
  }

  Hit({ damage }) {
    this.health.Add(-damage)
    if (this.health.value <= 0) {
      return true
    }
    return false
  }

  Update({ keys, game}) {
    if (this.health.value <= 0) {
      game.state = Game.STATE_END
      return
    }
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

    {
      const newstate = (keys.up || keys.down || keys.right || keys.left) ? STATE_MOVING : STATE_IDLE
      this._state.Shift(newstate)
    }

    if (this._state.Is(STATE_IDLE)) {
      this._state.Shift(STATE_DRAINING)
    }

    if (this._state.Is(STATE_DRAINING)) {
      (this.health.value >= 0.5) && this.health.Add(-0.25)
    } else {
      (this.health.value < 1.0) && this.health.Add(1.5)
    }
  }

  Draw(screen) {
    const ctx = screen.ctx
    ctx.save()

    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.strokeStyle = this.color
    ctx.shadowBlur = 6
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

export { Player }