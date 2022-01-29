import { Time } from "./System.js"

// Game carries the game state and related infomation
class Game {
  static STATE_UNSET =   Symbol("unset")
  static STATE_RUNNING = Symbol("running")
  static STATE_END =     Symbol("end")
  static STATE_PAUSE =   Symbol("pause")
  constructor() {
    this.state = Game.STATE_UNSET
    this._score = 0
    this.onScoreUpdate = null

    this.onEnd = null
  }

  get score() {
    return this._score
  }

  set score(val) {
    this._score = val
    this.onScoreUpdate && this.onScoreUpdate(val)
  }

  Run(stepper) {
    this.state = Game.STATE_RUNNING
    let start = null
    let frameEndTime = null
    const frame = highResTime => {
      start = start ?? highResTime
      const timestamp = highResTime - start

      frameEndTime = frameEndTime ?? Time.Now()
      const elapsedTime = Time.Since(frameEndTime)

      stepper({ timestamp, elapsedTime })

      frameEndTime = Time.Now()
      if (this.state !== Game.STATE_END) {
        requestAnimationFrame(frame)
      } 
    }
    requestAnimationFrame(frame)
  }
}

export { Game }