import { Enemy } from "./Enemy.js"

const taken = new WeakSet()

class Leecher extends Enemy {
  constructor(coord, compSet) {
    super(coord, "yellow", 27, 6, compSet)
    this.host = null
    let min = null

    for (let enemy of compSet.All()) {
      if (enemy instanceof Leecher || taken.has(enemy)) {
        continue
      }
      const dist = enemy.coord.Hypot(coord)
      min = min ?? dist

      if (dist <= min) {
        this.host = enemy
      }
    }
    taken.add(this.host)
  }

  Hit(damageData) {
    if (this.host) {
      const killed = this.host.Hit(damageData)
      this.host = (killed) ? null : this.host
      return false
    }
    return super.Hit(damageData)
  }

  Draw(screen) {
    if (this.host) {
      const { ctx } = screen
      ctx.save()
      ctx.strokeStyle = ctx.shadowColor = this.color
      ctx.shadowBlur = 5
      ctx.setLineDash([10, 5, 5])
      ctx.beginPath()
      ctx.moveTo(this.coord.x, this.coord.y)
      ctx.lineTo(this.host.coord.x, this.host.coord.y)
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }
    super.Draw(screen)
  }
}

export { Leecher }