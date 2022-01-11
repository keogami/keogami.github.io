import { Enemy } from "./Enemy.js"

const taken = new WeakSet()

class Leecher extends Enemy {
  constructor(coord, compSet) {
    super(coord, "#915fc4", 27, 6, 5, 10, 20, compSet)
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
    if (this.host) {
      taken.add(this.host)
      const call = () => {
        this.host.events.Remove(Enemy.EVENT_DEATH, call)
        this.host = null // remove the reference so that it can be garbage collected
      }
      this.host.events.On(Enemy.EVENT_DEATH, call)
    }
  }

  Hit(damageData) {
    if (this.host) {
      this.host.Hit(damageData)
      return
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