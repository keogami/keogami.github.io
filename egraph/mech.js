import { FrequencyTable } from './modules/FrequencyTable.js'

const dataSet = []
const drange = [10, 200]
const length = 90

// create random data, for now
{
  const [dmin, dmax] = drange
  const randint = (min, max) => Math.floor((Math.random() * (max - min))) + min

  for (let i = 0; i < length; ++i) {
    dataSet.push(randint(dmin, dmax))
  }

  const table = new FrequencyTable(dataSet, 10)

  // assert that shit is good, cuz i don't believe in myself
  {
    const total = [...table.Classes()].reduce((acc, it) => acc + it.length, 0)
    console.assert(
      total === dataSet.length,
      'Some data was lost during creation of the FrequecyTable',
      {
        shouldBe: dataSet.length, found: total,
      }
    )
  }
}