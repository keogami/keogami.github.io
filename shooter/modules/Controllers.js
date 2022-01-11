import { Coord } from "./System.js"
import { Event } from "./components/helpers/Event.js"

class Keyboard {
  constructor() {
    this.up = this.down = this.right = this.left = this.escape = false
  }
  Connect(element) {
    element.addEventListener("keydown", (ev) => {
      switch (ev.code) {
        case "KeyW":
        case "ArrowUp":
          this.up = true
          break
        case "KeyA":
        case "ArrowLeft":
          this.left = true
          break
        case "KeyS":
        case "ArrowDown":
          this.down = true
          break
        case "KeyD":
        case "ArrowRight":
          this.right = true
          break
      }
      ev.preventDefault()
    })
    
    element.addEventListener("keyup", (ev) => {
      switch (ev.code) {
        case "KeyW":
        case "ArrowUp":
          this.up = false
          break
        case "KeyA":
        case "ArrowLeft":
          this.left = false
          break
        case "KeyS":
        case "ArrowDown":
          this.down = false
          break
        case "KeyD":
        case "ArrowRight":
          this.right = false
          break
      }
      ev.preventDefault()
    })
  }
}

class Mouse {
  constructor() {
    this.coord = new Coord(0, 0)
    this.events = new Event()
    this.CLICK_LEFT = Symbol("left")
    this.CLICK_RIGHT = Symbol("right")
  }

  Connect(element) {
    element.addEventListener("mousemove", (ev) => {
      this.coord.x = ev.clientX
      this.coord.y = ev.clientY
    })

    element.addEventListener("click", (ev) => {
      ev.preventDefault()
      this.events.Emit(this.CLICK_LEFT, ev)
    })

    element.addEventListener("contextmenu", (ev) => {
      ev.preventDefault()
      this.events.Emit(this.CLICK_RIGHT, ev)
    })
  }
}

export { Keyboard, Mouse }