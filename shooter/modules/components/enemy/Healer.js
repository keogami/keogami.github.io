import { Enemy } from "./Enemy.js"

class Healer extends Enemy {
  constructor(coord, compSet) {
    super(coord, "green", 25, 8, 2, -5, 5, compSet)
  }
}

export { Healer }