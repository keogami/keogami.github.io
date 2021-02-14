const requestBuild = (data) => {
  return window.dispatchEvent(new CustomEvent('graphbuildreq', {
    detail: {
      data: data,
      barCount: Math.ceil(Math.sqrt(data.length)),
    }
  }))
}

const cEl = (elname) => (cl = "") => (id = "") => {
  const el = document.createElement(elname)
  if (cl !== "") {
    el.classList.add(cl)
  }
  if (id !== "") {
    el.id = id
  }
  return el
}

const createListItem = (() => {
  const cItem = cEl('div')('item')
  const cSpan = cEl('span')()
  const cClose = cEl('div')('close')

  return (val) => {
    const item = cItem()
    item.dataset.value = val
    
    const span = cSpan()
    span.innerText = val

    const close = cClose()
    item.appendChild(span)
    item.appendChild(close)

    return item
  }
})()

const lobby = document.querySelector('#lobby-items')

const updateResultsUsing = (extract) => (list) => {
  const data = [...list.children].map(extract).map(Number)
  return requestBuild(data)
}

const updateResults = updateResultsUsing(item => item.dataset.value)

document.querySelector('form').onsubmit = ev => {
  ev.preventDefault()

  const val = Number(document.querySelector('input#number').value)
  if (isNaN(val)) {
    // display hint
    return
  }

  const item = createListItem(val)
  lobby.appendChild(item)

  item.querySelector('.close').onclick = ev => {
    lobby.removeChild(item)
    updateResults(lobby)
  }

  updateResults(lobby)
}