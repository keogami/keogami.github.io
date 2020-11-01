import { Coord } from "../System.js"
import { Game } from "../Game.js"

class Player {
  constructor(coord, size, color, velocity) {
    this.coord = coord.Clone()
    this.size = size
    this.color = color
    this.velocity = velocity
    this._HP = 100
    this._maxHP = 100
    this.health = this._HP / this._maxHP
  }

  Update({ keys, game}) {
    if (this.health <= 0) {
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

    // HP deduction on idle, and regeneration on moving
    if (!(keys.up || keys.down || keys.right || keys.left)) { // idle
      if (this.health > 0.2) {
        this._HP -= 0.25
        this.health = this._HP / this._maxHP
      }
    } else {
      if (this.health < 1.0) {
        this._HP += 1.5
        this.health = this._HP / this._maxHP
      }
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
    ctx.arc(this.coord.x, this.coord.y, this.size + 5, 0, Math.PI * 2 * this.health)
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