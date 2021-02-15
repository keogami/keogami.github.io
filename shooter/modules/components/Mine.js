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

function calculateDamage(dist) {
  const bias = 0.75
  return 1 - (bias * dist)
}

class Mine {
  constructor(coord, color, size, range, damage, setTime, cookTime, compSet) {
    this.coord = coord.Clone()
    this.color = new Color(color, 1.0)
    this.size = size
    this.range = range
    this.trigRange = 0.8 * range
    this.damage = damage
    this.setTime = setTime
    this.cookTime = cookTime
    this.compSet = compSet

    this._staticColor = this.color.toString()

    this._trigTime = null
    this._trigRatio = 0.0
    this._trigFadeTime = 200 // ms
    this._damaged = false

    this._cooked = 0.0

    this._state = new State(STATE_COOKING, mineStateTransitions)
  }

  Update({ timestamp, screen }) {
    if (this._state.Is(STATE_COOKING)) {
      const dt = (timestamp - this.setTime)
      this._cooked = Math.min(1.0, dt / this.cookTime)
      if (dt >= this.cookTime) {
        this._state.Shift(STATE_COOKED)
      }
    }

    if (this._state.Is(STATE_COOKED)) {
      for (let enemy of screen.GetComponent("enemies").All()) {
        if (Coord.Dist(this.coord, enemy.coord) <= this.trigRange) {
          this._state.Shift(STATE_TRIGGERED)
          this._trigTime = timestamp
          break
        }
      }
    }

    if (this._state.Is(STATE_TRIGGERED)) {
      this._trigRatio = Math.min(1.0, (timestamp - this._trigTime) / this._trigFadeTime)
      this.color.alpha = 1.0 - this._trigRatio
      this._staticColor = this.color.toString()
      if (this._trigRatio === 1.0) {
        this.compSet.Remove(this)
        return
      }
      if (!this._damaged) {
        this._damaged = true
        for (let enemy of screen.GetComponent("enemies").All()) {
          const dist = Coord.Dist(this.coord, enemy.coord)
          if (dist <= this.range) {
            const damage = this.damage * calculateDamage(dist / this.range)
            enemy.Hit({ damage })
          }
        }
      }
    }
  }

  Draw({ ctx }) {
    ctx.save()

    ctx.strokeStyle = ctx.fillStyle = ctx.shadowColor = this._staticColor
    ctx.shadowBlur = this.size / 4
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.rect(this.coord.x - this.size / 2, this.coord.y - this.size / 2, this.size, this.size)
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(this.coord.x, this.coord.y, this.size + 2, 0, 2 * Math.PI * this._cooked)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.setLineDash([10, 5, 5, 5])
    ctx.arc(this.coord.x, this.coord.y, this.trigRange, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()

    if (this._state.Is(STATE_TRIGGERED)) {
      ctx.beginPath()
      ctx.arc(this.coord.x, this.coord.y, this.range * (1.0 - this._trigRatio), 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }
    ctx.restore()
  }
}

export { Mine }