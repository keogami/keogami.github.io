import { Coord } from "./System.js"

class Screen {
  constructor(canvas) {
    this._canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.origin = new Coord(canvas.width / 2, canvas.height / 2)
  }

  Resize(width, height) {
    this._canvas.width = width
    this._canvas.height = height
    this.origin.x = width / 2
    this.origin.y = height / 2
  }

  SetBackground(color) {
    this._canvas.style.backgroundColor = color
  }
}

export { Screen }