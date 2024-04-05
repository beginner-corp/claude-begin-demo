let ws
let messages = []

function init () {
  let button = document.getElementById('sendMessage')
  button.addEventListener('click', send)
  document.getElementById('userInput').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      let userInput = document.getElementById('userInput').value
      if (userInput) button.click()
    }
  })
}

async function connect (url) {
  ws = new WebSocket(url)

  ws.addEventListener('message', ({ data }) => {
    let message
    try {
      message = JSON.parse(data)
    }
    catch {
      console.log(`Error parsing WS message!`, message)
    }
    let { /* role, */ content, /* ts, id, */ updated } = message

    let responses = document.querySelector('#claude')

    if (!message.content) {
      let err = document.createElement('div')
      err.setAttribute('class', 'error')
      err.append(`Error: ${message.message || 'unknown error'}`)
      responses.append(err)
      return
    }

    let msgIndex = messages.findIndex(m => m.role === 'assistant' && m.id === message.id)
    if (msgIndex === -1) {
      messages.push(message)
    }
    else if (messages[msgIndex].updated < updated) {
      messages[msgIndex] = message
    }

    let id = `claude-response-${message.id}`
    let query = `#${id}`
    let item = document.querySelector(query)

    let div = document.createElement('div')
    div.setAttribute('id', id)
    div.setAttribute('class', 'margin-bottom-8')
    div.append('Claude: ' + content)

    if (item) item.replaceWith(div)
    else responses.append(div)
  })

  ws.addEventListener('error', console.error)

  /*
  ws.addEventListener('open', data => {
    console.log(`opened connection!`, data)
  })
  ws.addEventListener('close', data => {
    console.log('closing connection!', data)
  })
  */
}

function send () {
  let userInput = document.getElementById('userInput').value
  if (ws && userInput) {
    let accountID = sessionStorage.getItem('accountID')
    let dataID = sessionStorage.getItem('dataID')
    document.getElementById('userInput').value = ''

    let newURL = `/d/${dataID}`
    window.history.pushState({}, '', newURL)

    let message = {
      role: 'user',
      content: userInput,
      ts: Date.now(),
      id: self.crypto.randomUUID(),
    }
    messages.push(message)

    let responses = document.querySelector('#claude')
    let div = document.createElement('div')
    div.setAttribute('class', 'margin-bottom-8')
    div.append('You: ' + userInput)
    responses.append(div)

    // TODO: nonce
    ws.send(JSON.stringify({ accountID, dataID, messages }))
  }
}

export { init, connect, send }
