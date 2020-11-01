// Game carries the game state and related infomation
class Game {
  static STATE_UNSET =   Symbol("unset")
  static STATE_RUNNING = Symbol("running")
  static STATE_END =     Symbol("end")
  static STATE_PAUSE =   Symbol("pause")
  constructor() {
    this.state = Game.STATE_UNSET
    this.score = 0
  }
}

export { Game }