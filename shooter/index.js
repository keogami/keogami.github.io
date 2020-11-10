import { Screen } from "./modules/Screen.js";
import { Vector2, InfoDict } from "./modules/System.js";
import { Keyboard, Mouse } from "./modules/Controllers.js";
import { Player, Reticle, Projectile, ComponentSet } from "./modules/Components.js"
import { Game } from "./modules/Game.js"
import { Normie, Leecher } from "./modules/components/Enemies.js"
import { Enemy } from "./modules/components/enemy/Enemy.js";

const $ = document
const DEBUG = true

const putInfo = ((el) => (it) => {
  return el.innerText = it
})($.querySelector("div#info-pane"))

const screen = new Screen($.querySelector("canvas#main"))
screen.Resize(innerWidth, innerHeight)
screen.SetBackground("#07020b")

const reticle = new Reticle(screen.origin, "blue", 15)
screen.AddComponent("reticle", reticle)

const projectiles = new ComponentSet()
screen.AddComponent("projectiles", projectiles)

const enemies = new ComponentSet()
screen.AddComponent("enemies", enemies)

const enemyList = [Normie, Leecher]
function spawnEnemies() {
  if (enemies._components.size > 5) {
    return
  }
  const coord = screen.RandomCoord({ outside: true })

  const rand = Math.floor(Math.random() * enemyList.length)
  enemies.Add(new enemyList[rand](coord, enemies))
}
let stopSpawning = null

function shootProjectiles() {
  const player = screen.GetComponent("player")
  const vel = Vector2.Slope(player.coord, reticle.coord).Scale(16)
  projectiles.Add(new Projectile(player.coord, "pink", 8, vel, 3))
}


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
const printScore = (val) => {
  scoreboard.innerHTML = "KP=" + val.toString().padStart(16, "0")
}
game.onScoreUpdate = printScore

function frame({ timestamp, elapsedTime }) {
  // Update and draw the screen
  screen.Update({ game, keys, mouse, elapsedTime, timestamp, screen })
  screen.Draw()
  if (keys.escape || game.state === Game.STATE_END) {
    endGame()
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

}

let scorePrintingIntervalHandle = null

function endGame() {
  stopSpawning()
  removeEventListener("click", shootProjectiles)

  const animTime = 1000
  setTimeout(() => {
    setTimeout(() => {
      scoreboard.classList.add("center")
    }, animTime * 0.85)
    setTimeout(() => {
      const it = $.querySelector("div.game-control")
      it.classList.remove("clicked")
      it.addEventListener("click", startGame)
      // [Todo] incorrectly coupled with animTime, instead of scoreboard's animation time
      // use transitionEnd on scoreboard as a trigger(?)
    }, animTime * 2.2)
    const player = screen.GetComponent("player")
    requestAnimationFrame(screen.ClearAnimation(player.coord, "#07020b45", animTime))
    scorePrintingIntervalHandle = setInterval(() => printScore(game.score), 400) // to prevent people from changing score manually
  }, 100)
}

function startGame() {
  scoreboard.classList.remove("center")
  this.removeEventListener("click", startGame)
  this.classList.add("clicked")
  scorePrintingIntervalHandle ?? clearInterval(scorePrintingIntervalHandle)

  screen.AddComponent("player", new Player(screen.origin, 25, "#a80707", new Vector2(8, 8)))
  screen.GetComponent("projectiles").Clear()
  screen.GetComponent("enemies").Clear()
  game.score = 0

  setTimeout(() => {
    game.Run(frame)
    addEventListener("click", shootProjectiles)
    const id = setInterval(spawnEnemies, 1000)
    stopSpawning = () => clearInterval(id)
  }, 500)
}

$.querySelector("div.game-control").addEventListener("click", startGame)
