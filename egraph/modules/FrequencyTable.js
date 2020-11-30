import { Class } from './Class.js'

const intervalSize = (min, max, classCount) => Math.ceil((max - min) / classCount)

class FrequencyTable {
  constructor(data, classCount) {
    const sorted = data.sort((a, b) => a - b)
    const [min, max] = [sorted[0], sorted[sorted.length - 1]]
    const csize = intervalSize(min, max, classCount)

    const classes = new Set()
    this._classes = classes

    // [MiOpt] if the performance becomes too much an issue, then we can try joining
    //         the loops for creation and filling of classes.
    // however, it is quite readable as it stands now.

    // create the classes
    for (let cur = min; cur <= max; cur += csize) {
      classes.add(new Class(cur, cur + csize))
    }

    // fill the classes with values
    {
      let prev = 0
      for (let cl of classes) {
        for (let cur = prev; cur < sorted.length; cur++) {
          if (!cl.Accepts(sorted[cur])) {
            prev = cur
            break
          }
          cl.Record(sorted[cur])
        }
      }
    }
  }

  Classes() {
    return this._classes
  }

  MaxFrequency() {
    return [...this.Classes()].reduce((acc, it) => (it.length > acc.length) ? it : acc).length
  }
}

export { FrequencyTable }