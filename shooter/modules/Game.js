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
  }

  get score() {
    return this._score
  }

  set score(val) {
    this._score = val
    this.onScoreUpdate && this.onScoreUpdate(val)
  }
}

export { Game }