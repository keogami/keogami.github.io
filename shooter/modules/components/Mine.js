import { State } from "../State.js"
import { Color } from "./helpers/Color.js"
import { Coord } from "../System.js"

const STATE_COOKING = Symbol("cooking")
const STATE_COOKED = Symbol("cooked")
const STATE_TRIGGERED = Symbol("triggered")

const mineStateTransitions = [
  [STATE_COOKING, STATE_COOKED],
  [STATE_COOKED, STATE_TRIGGERED]
]

function calculateDamage(base, dist, dt) {
  return base
  if (dist === 0) {
    return base * dt
  }
  return base * (1 / dist) * dt
}

class Mine {
  constructor(coord, color, size, range, damage, setTime, cookTime, compSet) {
    this.coord = coord.Clone()
    this.color = new Color(color, 1.0)
    this.size = size
    this.range = range
    this.damage = damage
    this.setTime = setTime
    this.cookTime = cookTime
    this.compSet = compSet

    this._staticColor = this.color.toString()

    this._trigTime = null
    this._trigFadeTime = 100 // ms

    this._cooked = 0.0

    this._state = new State(STATE_COOKING, mineStateTransitions)
  }

  Update({ timestamp, screen}) {
    if (this._state.Is(STATE_COOKING)) {
      const dt = (timestamp - this.setTime)
      this._cooked = Math.min(1.0, dt / this.cookTime)
      if (dt >= this.cookTime) {
        this._state.Shift(STATE_COOKED)
      }
    }

    if (this._state.Is(STATE_COOKED)) {
      for (let enemy of screen.GetComponent("enemies").All()) {
        if (Coord.Dist(this.coord, enemy.coord) <= this.range) {
          this._state.Shift(STATE_TRIGGERED)
          this._trigTime = timestamp
          console.log("triggered")
          break
        }
      }
    }

    if (this._state.Is(STATE_TRIGGERED)) {
      const trigRatio = Math.min(1.0, (timestamp - this._trigTime) / this._trigFadeTime)
      if (trigRatio === 1.0) {
        this.compSet.Remove(this)
        return
      }
      for (let enemy of screen.GetComponent("enemies").All()) {
        const dist = Coord.Dist(this.coord, enemy.coord)
        if (dist <= this.range) {
          const damage = calculateDamage(this.damage, dist, trigRatio)
          enemy.Hit({ damage })
          console.log({ damage, trigRatio, dist})
        }
      }
    }
  }

  Draw({ ctx }) {
    if (!this._state.Is(STATE_TRIGGERED)) {
      ctx.save()

      ctx.strokeStyle = ctx.fillStyle = ctx.shadowColor = this._staticColor
      ctx.shadowBlur = this.size / 4
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.rect(this.coord.x - this.size/2, this.coord.y - this.size/2, this.size, this.size)
      ctx.fill()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(this.coord.x, this.coord.y, this.size + 2, 0, 2 * Math.PI * this._cooked)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.setLineDash([10, 5, 5, 5])
      ctx.arc(this.coord.x, this.coord.y, this.range, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.restore()
    }
  }
}

export { Mine }