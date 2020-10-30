class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Coord extends Vector2 {
  constructor(x, y) {
    super(x, y)
  }
}

export { Vector2, Coord }