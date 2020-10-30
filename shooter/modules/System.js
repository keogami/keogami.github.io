class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  Add(v2) {
    this.x += v2.x
    this.y += v2.y
  }
}

class Coord extends Vector2 {
  constructor(x, y) {
    super(x, y)
  }
}

export { Vector2, Coord }