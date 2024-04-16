/* globals document customElements */
import CustomElement from '@enhance/custom-element'
import enhance from '@enhance/element'

import API from './api.mjs'
import UIAssistantMessageElement from '../elements/ui-assistant-message.mjs'
import UIUserMessageElement from '../elements/ui-user-message.mjs'
import UIMessageList from '../elements/ui-message-list.mjs'
import UIInput from '../elements/ui-input.mjs'

const wssurl = document.querySelector('main').dataset.wssurl
const api = API({ wssurl })

enhance('ui-message-list', {
  api,
  keys: [ 'messages' ],
  render (args) {
    return UIMessageList(args)
  },
})

enhance('ui-input', {
  api,
  connectedCallback () {
    this.form = this.querySelector('form')
    this.input = this.form.querySelector('input')
    this.form.addEventListener('submit', e => {
      e.preventDefault()
      this.api.send(this.input.value)
      this.input.value = ''
    })
  },
  render (args) {
    return UIInput(args)
  },
})

class UIAssistantMessage extends CustomElement {
  constructor () {
    super()
  }

  render (args) {
    return UIAssistantMessageElement(args)
  }
}

customElements.define('ui-assistant-message', UIAssistantMessage)

class UIUserMessage extends CustomElement {
  constructor () {
    super()
  }

  render (args) {
    return UIUserMessageElement(args)
  }
}

customElements.define('ui-user-message', UIUserMessage)
