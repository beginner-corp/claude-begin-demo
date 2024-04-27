/* globals window document customElements */
import xss from 'xss'
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
  keys: ['messages'],
  connectedCallback() {
    // Observe the scrollanchor element and keep it in view;
    // this keeps incoming message content in view when overflowing the scroll area.
    const intersectionObserver = new IntersectionObserver((entries) => {
      const [{ target: scrollAnchor }] = entries

      if (!scrollanchor.isIntersecting) {
        scrollanchor.scrollIntoView()
      }
    })

    intersectionObserver.observe(document.getElementById('scrollanchor'))
  },
  render(args) {
    return UIMessageList(args)
  },
})

enhance('ui-input', {
  api,
  connectedCallback() {
    this.form = this.querySelector('form')
    this.input = this.form.querySelector('input')
    this.form.addEventListener('submit', e => {
      e.preventDefault()
      this.api.send(this.input.value)
      this.input.value = ''
    })
  },
  render(args) {
    return UIInput(args)
  },
})

class UIAssistantMessage extends CustomElement {
  constructor() {
    super()
    this.debounce = this.debounce.bind(this)
  }

  render(args) {
    return UIAssistantMessageElement(args)
  }

  static get observedAttributes () {
    return [ 'updated' ]
  }

  connectedCallback() {
    this.syntaxHighlight()
  }

  updatedChanged() {
    this.syntaxHighlight()
  }

  debounce(func, delay=1000) {
    let timeoutId
    return function(...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  syntaxHighlight() {
    const $code = this.querySelectorAll('code.hljs')
    for (const code of $code) {
      if (!code.dataset.highlighted) {
        window?.hljs?.highlightElement(code)
      }
    }
  }
}

customElements.define('ui-assistant-message', UIAssistantMessage)

class UIUserMessage extends CustomElement {
  constructor() {
    super()
  }

  render(args) {
    return UIUserMessageElement(args)
  }
}

customElements.define('ui-user-message', UIUserMessage)
