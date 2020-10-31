import { Screen } from "./modules/Screen.js";
import { Vector2, InfoDict, Time } from "./modules/System.js";
import { Keyboard, Mouse } from "./modules/Controllers.js";

const $ = document
const DEBUG = true

const putInfo = ((el) => (it) => {
  return el.innerText = it
})($.querySelector("div#info-pane"))


class Player {
  constructor(coord, size, color, velocity) {
    this.coord = coord
    this.size = size
    this.color = color
    this.velocity = velocity
  }

  Update(data) {
    const keys = data.keys
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
  }

  Draw(screen) {
    const ctx = screen.ctx
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.shadowBlur = 6
    ctx.shadowColor = "#af1313"
    ctx.arc(this.coord.x, this.coord.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
}

const screen = new Screen($.querySelector("canvas#main"))
screen.Resize(innerWidth, innerHeight)
screen.SetBackground("black")

const p = new Player(screen.origin, 25, "#a80707", new Vector2(4, 4))
screen.AddComponent(p)


const keys = new Keyboard()
keys.Connect(window)
const mouse = new Mouse()
mouse.Connect(window)
const info = new InfoDict()
let timeAVG = 0
let FPS = 0

const requiredFPS = 60
const requiredTime = 1000 / requiredFPS

let frameEndTime = null

function frame() {
  if (keys.escape) {
    return
  }
  frameEndTime = frameEndTime ?? Time.Now() // for the first frame, endtime is null

  const elapsedTime = Time.Since(frameEndTime)

  // Update and draw the screen
  const start = Time.Now()
  screen.Update({ keys, mouse, elapsedTime })
  screen.Draw()
  const took = Time.Since(start)

  // if debug data is required, calculate it and print it
  if (DEBUG) {
    timeAVG += elapsedTime.value
    timeAVG /= 2
    FPS = Math.round(1000 / timeAVG)
    info.Set("Mouse-X", mouse.coord.x)
    info.Set("Mouse-Y", mouse.coord.y)
    info.Set("FPS", FPS)
    putInfo(info.String("\n"))
  }

  if (took.value >= requiredTime) {
    requestAnimationFrame(frame)
  } else {
    DEBUG && info.Set("Wait", `${Math.round(requiredTime - took.value)}ms`)
    setTimeout(() => requestAnimationFrame(frame), requiredTime - took.value)
  }

  frameEndTime = Time.Now()
}

frame()
