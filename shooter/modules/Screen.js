import { Coord } from "./System.js"

// Screen handles the game's interaction with the canvas
// it keeps the list of component that are "drawn" on the screen
// the components can be inserted and deleted from the screen
//
// Updating the screen updates all the components on the screen
// the component MAY NOT have an .Update(data) method, in which case the component remains static
// updates are done in order of insertion, but the aplication MUST NOT depend on this detail
//
// Drawing the screen simply implies clearing the canvas and drawing the components
// all components MUST have a .Draw(screen) method
class Screen {
  constructor(canvas) {
    this._canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.origin = new Coord(canvas.width / 2, canvas.height / 2)
    this._components = new Map()
  }

  Resize(width, height) {
    this._canvas.width = width
    this._canvas.height = height
    this.origin.x = width / 2
    this.origin.y = height / 2
  }

  InBound(coord) {
    if (coord.x < 0 || coord.x > this._canvas.width) {
      return false
    }
    if (coord.y < 0 || coord.y > this._canvas.height) {
      return false
    }
    return true
  }

  RandomCoord({ outside }) {
    let x = Math.random(), y = Math.random()
    if (!outside) {
      x *= this._canvas.width
      y *= this._canvas.height
    } else {
      if (Math.random() >= 0.5) {
        x = (Math.random() >= 0.5) ? 0 : this._canvas.width
        y *= this._canvas.height
      } else {
        x *= this._canvas.width
        y = (Math.random() >= 0.5) ? 0 : this._canvas.height
      }
    }
    return new Coord(x, y)
  }

  SetBackground(color) {
    this._canvas.style.backgroundColor = color
  }

  AddComponent(name, it) {
    this._components.set(name, it)
  }

  GetComponent(name) {
    return this._components.get(name)
  }

  RemoveComponent(name) {
    return this._components.delete(name)
  }

  Update(data) {
    for (let [name, comp] of this._components) {
      comp.Update && comp.Update(data)
    }
  }

  Clear() {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  Draw() {
    this.Clear()
    for (let [name, comp] of this._components) {
      comp.Draw(this)
    }
  }

  ClearAnimation(coord, color, dt) {
    const endRad = Math.hypot(this._canvas.width, this._canvas.height)
    let start = null
    const { ctx } = this
    const frame = function (time) {
      start = start || time
      const et = time - start
      const rad = Math.min(endRad * (et / dt), endRad)
      if (rad === endRad) {
        return
      }

      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(coord.x, coord.y, rad, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()

      requestAnimationFrame(frame)
    }
    return frame
  }
}

export { Screen }