const _state = {};
const dirtyProps = [];
const listeners = [];
const inWindow = typeof window != 'undefined';
const set = inWindow
  ? window.requestAnimationFrame
  : setTimeout;
const cancel = inWindow
  ? window.cancelAnimationFrame
  : clearTimeout;
let timeout;
const handler = {
  set: function (obj, prop, value) {
    if (prop === 'initialize' ||
        prop === 'subscribe' ||
        prop === 'unsubscribe') {
      return false
    }
    let oldValue = obj[prop];
    if (oldValue !== value) {
      obj[prop] = value;
      dirtyProps.push(prop);
      timeout && cancel(timeout);
      timeout = set(notify);
    }

    return true
  }
};

_state.initialize = initialize;
_state.subscribe = subscribe;
_state.unsubscribe = unsubscribe;
const store$1 = new Proxy(_state, handler);

function Store(initialState) {
  if (initialState) {
    initialize(initialState);
  }
  return store$1
}

function merge (o, n) {
  for (let prop in n) {
    o[prop] = n[prop];
  }
}

/**
 * Function for initializing store with existing data
 * @param {object} initialState - object to be merged with internal state
 */
function initialize(initialState) {
  if (initialState) {
    merge(_state, initialState);
  }
}

/**
 * Function for subscribing to state updates.
 * @param {function} fn - function to be called when state changes
 * @param {array} props - list props to listen to for changes
 * @return {number} returns current number of listeners
 */
function subscribe(fn, props=[]) {
  return listeners.push({ fn, props })
}

/**
 * Function for unsubscribing from state updates.
 * @param {function} fn - function to unsubscribe from state updates
 *
 */
function unsubscribe(fn) {
  return listeners.splice(listeners.findIndex(l => l.fn === fn), 1)
}

function notify() {
  listeners.forEach(l => {
    const fn = l.fn;
    const props = l.props;
    const payload = props.length
      ? dirtyProps
        .filter(key => props.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: _state[key]
          }
        }, {})
      : { ..._state };
    if (Object.keys(payload).length)  {
      fn(payload);
    }
  });
  dirtyProps.length = 0;
}

/* globals window WebSocket */

const store = Store({
  messages: [],
});

function API ({ wssurl }) {
  function send (prompt) {
    if (ws) {
      const accountID = window.sessionStorage.getItem('accountID');
      const dataID = window.sessionStorage.getItem('dataID');

      let newURL = `/d/${dataID}`;
      window.history.pushState({}, '', newURL);

      const message = {
        role: 'user',
        content: prompt,
        ts: Date.now(),
        id: window.crypto.randomUUID(),
      };

      store.messages = [
        ...store.messages,
        message,
      ];

      // TODO: nonce
      ws.send(JSON.stringify({ accountID, dataID, messages: store.messages }));
    }
  }

  function receive ({ data }) {
    let message;
    try {
      message = JSON.parse(data);
    }
    catch {
      console.log(`Error parsing WS message!`, message);
    }
    let { /* role, content, ts, id, */ updated } = message;

    if (!message.content) {
      console.error(message);
    }

    let msgIndex = store.messages.findIndex(m => m.role === 'assistant' && m.id === message.id);
    if (msgIndex === -1) {
      store.messages = [
        ...store.messages,
        message,
      ];
    }
    else if (store.messages[msgIndex].updated < updated) {
      store.messages = [ ...store.messages ];
      store.messages[msgIndex] = message;
    }
  }

  // Go, WebSocket!
  const ws = new WebSocket(wssurl);
  ws.onmessage = receive;
  ws.onerror = console.error;

  return {
    send,
    store,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe,
  }

}

export { API as default };
