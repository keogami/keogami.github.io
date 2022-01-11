class Color {
  constructor(rgb, alpha) {
    this.rgb = rgb
    this.alpha = alpha ?? 1.0
  }

  get rgb() {
    return (
      (this.red << 16) |
      (this.green << 8) |
      (this.blue)
    )
  }

  set rgb(rgb) {
    rgb = (rgb >>> 0) & 0xFFFFFF
    this.red = (rgb & 0xFF0000) >>> 16
    this.green = (rgb & 0x00FF00) >>> 8
    this.blue = (rgb & 0x0000FF) >>> 0
  }

  toString() {
    return (
      "rgba(" +
      this.red + "," +
      this.green + "," +
      this.blue + "," +
      this.alpha + ")"
    )
  }
}

export { Color }