class Marker {
  constructor() {
    this.labels = null
    this.adjust = null
    this.count = 0
    this.fixedAt = 0
    this.size = 5
    this.align = ""
  }

  HasLabels() {
    return this.labels !== null && this.adjust !== null
  }

  Labels(generator) {
    this.labels = generator
    return this
  }

  AdjustUsing(adjuster) {
    this.adjust = adjuster
    return this
  }

  Count(c) {
    this.count = c
    return this
  }

  FixedAt(dist) {
    this.fixedAt = dist
    return this
  }

  Size(s) {
    this.size = s
    return this
  }

  Align(val) {
    this.align = val
    return this
  }
}

export { Marker }