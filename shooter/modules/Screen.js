import { Coord } from "./System.js"

// Screen handles the game's interaction with the canvas
// it keeps the list of component that are "drawn" on the screen
// the components can inserted and deleted from the screen
//
// Updating the screen updates all the components on the screen
// the component MAY NOT have an .Update(data) method, in which case its not drawn
// updates are done in order of insertion, but the aplication mustn't depend on this detail
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

  SetBackground(color) {
    this._canvas.style.backgroundColor = color
  }

  AddComponent(name, it) {
    this._components.set(name, it)
    console.log(this._components)
  }

  GetComponent(name) {
    return this._components.get(name)
  }

  RemoveComponent(name) {
    return this._components.delete(name)
  }

  Update(data) {
    for (let [ name, comp ] of this._components) {
      comp.Update && comp.Update(data)
    } 
  }

  Clear() {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  Draw() {
    this.Clear()
    for (let [ name, comp ] of this._components) {
      comp.Draw(this)
    }
  }
}

export { Screen }