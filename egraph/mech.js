import { FrequencyTable } from './modules/FrequencyTable.js'
import { ChartBuilder } from './modules/Chart.js'
import { Ruling } from './modules/drawables/ruling/Ruling.js'
import { Marker } from './modules/drawables/ruling/Marker.js'
import { Histogram } from './modules/drawables/Histogram.js'
import { FrequencyPolygon } from './modules/drawables/FrequencyPolygon.js'
import { FrequencyCurve } from './modules/drawables/FrequencyCurve.js'

const res = { width: 640, height: 480 }
const margin = 40
let style = getComputedStyle(document.body)
const  fg = style.getPropertyValue('--theme-depth2-fg') || '#13c4a3'
const  bg = style.getPropertyValue('--theme-depth2-bg') || '#28282c'
style = null



const classLabels = function* (classes) {
  yield ""
  let first = true
  for (let cl of classes) {
    if (first) {
      first = false
      yield cl.lower
    }
    yield cl.upper
  }
}

const range = function* (from, to) {
  for (let i = from; i < to; i++) {
    yield i
  }
}

const _generateXMarker = (res) => (margin) => (table) => {
  const f = (res.width - (2 * margin)) / (table.Classes().size + 2)
  const m = new Marker()
    .Align('center')
    .Count(table.Classes().size + 2)
    .Size(2)
    .FixedAt(f)
    .Labels(classLabels(table.Classes()))
    .AdjustUsing(p => ({ x: p.x, y: p.y + 20 }))
  return { marker: m, fixture: f }
}

const _generateYMarker = (res) => (margin) => (table) => {
  const maxFreq = table.MaxFrequency()
  const f = (res.height - (2 * margin)) / (maxFreq + 1)
  const m = new Marker()
    .Align('right')
    .Count(maxFreq + 1)
    .Size(2)
    .FixedAt(f)
    .Labels(range(0, maxFreq + 1))
    .AdjustUsing(p => ({ x: p.x - 20, y: p.y + 4 }))
  return { marker: m, fixture: f }
}

const createXMarker = _generateXMarker(res)(margin)
const createYMarker = _generateYMarker(res)(margin)

const chartBuilder = new ChartBuilder()
  .Resolution(res.width, res.height)
  .Background(bg)
  .Margin(margin)

const drawHistogram = (chart) => (ruling) => ({ fx, fy }) => (table) => {
  ruling.DrawOn(chart)
  new Histogram()
    .For(table)
    .Color(fg)
    .Fixtures(fx, fy)
    .DrawOn(chart)
  return chart
}

const drawPolygon = (chart) => (ruling) => ({ fx, fy }) => (table) => {
  ruling.DrawOn(chart)
  new FrequencyPolygon()
    .For(table)
    .Color(fg)
    .Fixtures(fx, fy)
    .DotSize(2)
    .DrawOn(chart)
  return chart
}

const drawCurve = (chart) => (ruling) => ({ fx, fy }) => (table) => {
  ruling.DrawOn(chart)
  new FrequencyCurve()
    .For(table)
    .Color(fg)
    .Fixtures(fx, fy)
    .Smoothness(0.2)
    .DrawOn(chart)
  return chart
}

const emptyOutElement = (el) => {
  [...el.children].map(child => void el.removeChild(child))
}

addEventListener('graphbuildreq', ({ detail: { data, barCount } }) => {
  emptyOutElement(document.querySelector('.results'))

  if (data.length === 0) {
    return
  }

  const table = new FrequencyTable(data, barCount)

  const makeXMarker = () => createXMarker(table)
  const makeYMarker = () => createYMarker(table)

  const { fixture: fx } = makeXMarker()
  const { fixture: fy } = makeYMarker()


  const createRuling = () => {
    const { marker: mx } = makeXMarker()
    const { marker: my } = makeYMarker()
    return new Ruling()
      .Color(fg)
      .ForX(mx)
      .ForY(my)
  }

  ([ drawHistogram, drawPolygon, drawCurve ])
    .map(it => it(chartBuilder.Build()))
    .map(it => it(createRuling()))
    .map(it => it({ fx, fy }))
    .map(it => it(table))
    .map(it => it.SettleIn(document.querySelector('.results')))
})