class Chart {
  constructor(width, height, margin = 0, background = 'white') {
    this._canvas = document.createElement('canvas')
    this.margin = margin
    this.width = width
    this.height = height
    this.background = background
    this.context = this._canvas.getContext('2d')
  }

  SettleIn(parent) {
    parent.appendChild(this._canvas)
  }

  set width(val) {
    this._canvas.width = val
  }

  get width() {
    return this._canvas.width
  }

  set height(val) {
    this._canvas.height = val
  }

  get height() {
    return this._canvas.height
  }

  set background(val) {
    this._canvas.style.setProperty('background', val)
  }

  get background() {
    return this._canvas.style.getPropertyValue('background')
  }

  get drawableRegion() {
    return {
      // for y, `to` and `from` are swapped (unlike x) because it is more intuitive
      // to have the positive side go from bottom(origin) to top.
      x: { from: this.margin, to: this.width - this.margin },
      y: { from: this.height - this.margin, to: this.margin  },
    }
  }

  get origin() {
    return {
      x: this.margin,
      y: this.height - this.margin,
    }
  }
}



class ChartBuilder {
  constructor() {
    this._data = {
      res: { width: 0, height: 0 },
      bg: 'white',
      margin: 0,
    }
  }

  Resolution(width, height) {
    this._data.res = { width, height }
    return this
  }

  Background(val) {
    this._data.bg = val
    return this
  }

  Margin(val) {
    this._data.margin = val
    return this
  }

  Build() {
    const { _data: { res, margin, bg } } = this
    return new Chart(
      res.width, res.height,
      margin, bg,
    )
  }
}

export { Chart, ChartBuilder }