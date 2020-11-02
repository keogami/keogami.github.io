import { Screen } from "./modules/Screen.js";
import { Vector2, InfoDict, Time } from "./modules/System.js";
import { Keyboard, Mouse } from "./modules/Controllers.js";
import { Player, Reticle, Projectile, Enemy, ComponentSet } from "./modules/Components.js"
import { Game } from "./modules/Game.js"

const $ = document
const DEBUG = true

const putInfo = ((el) => (it) => {
  return el.innerText = it
})($.querySelector("div#info-pane"))

const screen = new Screen($.querySelector("canvas#main"))
screen.Resize(innerWidth, innerHeight)
screen.SetBackground("#07020b")

const player = new Player(screen.origin, 25, "#a80707", new Vector2(8, 8))
screen.AddComponent("player", player)

const reticle = new Reticle(screen.origin, "blue", 15)
screen.AddComponent("reticle", reticle)

const projectiles = new ComponentSet()
screen.AddComponent("projectiles", projectiles)

const enemies = new ComponentSet()
screen.AddComponent("enemies", enemies)

setInterval(() => {
  if (enemies._components.size > 5) {
    return
  }
  enemies.Add(new Enemy(screen.RandomCoord({outside: true}), "brown", 35, new Vector2(0, 0), enemies))
}, 1000)

addEventListener('click', (ev) => {
  const vel = Vector2.Slope(player.coord, reticle.coord).Scale(16)
  projectiles.Add(new Projectile(player.coord, "pink", 8, vel, 3))
})


const keys = new Keyboard()
keys.Connect(window)
const mouse = new Mouse()
mouse.Connect(window)
const info = new InfoDict()
let timeAVG = 0
let FPS = 0

const game = new Game()
game.state = Game.STATE_RUNNING

const scoreboard = $.querySelector("div#scoreboard")
game.onScoreUpdate = (val) => {
  scoreboard.innerHTML = "KP=" + val.toString().padStart(16, "0")
}

let frameEndTime

let gameStartTime

function frame(highResTime) {
  if (gameStartTime === undefined) {
    gameStartTime = highResTime
  }
  const timestamp = highResTime - gameStartTime
  
  frameEndTime = frameEndTime ?? Time.Now() // for the first frame, endtime is null

  const elapsedTime = Time.Since(frameEndTime)

  // Update and draw the screen
  screen.Update({ game, keys, mouse, elapsedTime, timestamp, screen })
  screen.Draw()
  if (keys.escape || game.state === Game.STATE_END) {
    return
  }



  // if debug data is required, calculate it and print it
  if (DEBUG) {
    timeAVG += elapsedTime.value
    timeAVG /= 2
    FPS = Math.round(1000 / timeAVG)
    info.Set("Mouse-X", mouse.coord.x)
    info.Set("Mouse-Y", mouse.coord.y)
    info.Set("FPS", FPS)
    info.Set("Elapsed", `${elapsedTime.value}ms`)
    putInfo(info.String("\n"))
  }

  frameEndTime = Time.Now()
  requestAnimationFrame(frame)  
}

requestAnimationFrame(frame)
