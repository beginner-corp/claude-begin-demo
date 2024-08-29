/* globals window WebSocket */
import Store from '@enhance/store'

const initialMessages = document.getElementById('initialMessages')?.textContent
const store = Store({
  messages: initialMessages ? JSON.parse(initialMessages) : []
})

export default function API ({ wssurl }) {
  function send (prompt) {
    if (ws) {
      const accountID = window.sessionStorage.getItem('accountID')
      const dataID = window.sessionStorage.getItem('dataID')

      let newURL = `/d/${dataID}`
      window.history.pushState({}, '', newURL)

      const message = {
        role: 'user',
        content: prompt,
        ts: Date.now(),
        id: window.crypto.randomUUID(),
      }

      store.messages = [
        ...store.messages,
        message,
      ]

      // TODO: nonce
      ws.send(JSON.stringify({ accountID, dataID, messages: store.messages }))
    }
  }

  function receive ({ data }) {
    let message
    try {
      message = JSON.parse(data)
    }
    catch {
      console.log(`Error parsing WS message!`, message)
    }
    let { /* role, content, ts, id, */ updated } = message

    if (!message.content) {
      console.error(message)
    }

    let msgIndex = store.messages.findIndex(m => m.role === 'assistant' && m.id === message.id)
    if (msgIndex === -1) {
      store.messages = [
        ...store.messages,
        message,
      ]
    }
    else if (store.messages[msgIndex].updated < updated) {
      store.messages = [ ...store.messages ]
      store.messages[msgIndex] = message
    }
  }

  // Go, WebSocket!
  const ws = new WebSocket(wssurl)
  ws.onmessage = receive
  ws.onerror = console.error

  return {
    send,
    store,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe,
  }

}
