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

    if (!message.content) {
      console.error(message)
    }

    let msgIndex = messages.findIndex(m => m.role === 'assistant' && m.id === message.id)
    if (msgIndex === -1) {
      messages.push(message)
    }
    else if (messages[msgIndex].updated < updated) {
      messages[msgIndex] = message
    }

    document.dispatchEvent(new CustomEvent('newmessage', {
      detail: {
        message,
      },
    }))
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

    // TODO: nonce
    ws.send(JSON.stringify({ accountID, dataID, messages }))

    document.dispatchEvent(new CustomEvent('newmessage', {
      detail: {
        message,
      },
    }))
  }
}

export { init, connect, send }
