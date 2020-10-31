import { Screen, ComponentSet } from "./modules/Screen.js";
import { Vector2, InfoDict, Time, Coord } from "./modules/System.js";
import { Keyboard, Mouse } from "./modules/Controllers.js";
import { Player, Reticle, Projectile, Enemy } from "./modules/Components.js"

const $ = document
const DEBUG = true

const putInfo = ((el) => (it) => {
  return el.innerText = it
})($.querySelector("div#info-pane"))

const screen = new Screen($.querySelector("canvas#main"))
screen.Resize(innerWidth, innerHeight)
screen.SetBackground("black")

const player = new Player(screen.origin, 25, "#a80707", new Vector2(8, 8))
screen.AddComponent("player", player)

const reticle = new Reticle(screen.origin, "blue", 15)
screen.AddComponent("reticle", reticle)

const projectiles = new ComponentSet()
screen.AddComponent("projectiles", projectiles)

const enemies = new ComponentSet()
screen.AddComponent("enemies", enemies)

enemies.Add(new Enemy(new Coord(90, 90), "brown", 35, new Vector2(0, 0)))

addEventListener('click', (ev) => {
  const vel = Vector2.Slope(player.coord, reticle.coord).Scale(16)
  projectiles.Add(new Projectile(player.coord, "pink", 8, vel))
})


const keys = new Keyboard()
keys.Connect(window)
const mouse = new Mouse()
mouse.Connect(window)
const info = new InfoDict()
let timeAVG = 0
let FPS = 0

const requiredFPS = 60
const requiredTime = 1000 / requiredFPS // In ms

let frameEndTime = null

function frame() {
  if (keys.escape) {
    return
  }
  frameEndTime = frameEndTime ?? Time.Now() // for the first frame, endtime is null

  const elapsedTime = Time.Since(frameEndTime)

  // Update and draw the screen
  const start = Time.Now()
  screen.Update({ keys, mouse, elapsedTime, screen })
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
    DEBUG && info.Set("Wait", "00ms")
  } else {
    DEBUG && info.Set("Wait", `${Math.round(requiredTime - took.value)}ms`)
    setTimeout(() => requestAnimationFrame(frame), requiredTime - took.value)
  }

  frameEndTime = Time.Now()
}

frame()
