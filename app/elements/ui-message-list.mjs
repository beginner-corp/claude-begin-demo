import xss from 'xss'

export default function MessageList({ html, state }) {
  const { store, instanceID } = state
  const { messages = [] } = store
  const fenceRegex = /`{3}([\w]*)\n([\S\s]+?)\n`{3}/g
  const inlineRegex = /(\s`{1})(?!`{2})(.+?)(?<!`{2})`{1}/g

  function addCodeBlocks (message) {
    return message.replace(fenceRegex, (match, lang, code) => {
      return `</p><pre><code class="hljs ${ lang ? `language-${lang}` : 'language-bash' }">${xss(code.trim())}</code></pre><p>`
    })
  }

  function addInlineCodeBlocks (message) {
    return message.replace(inlineRegex, (match, lang, code) => {
      return `<code class="hljs language-bash">${xss(code.trim())}</code>`
    })
  }

  const messagesMarkup = messages.map(m => {
    return m.role === 'assistant'
      ? `
      <li id="${m.id}-${m.role}" class="flex justify-content-start">
        <ui-assistant-message updated="${m.updated}">${addInlineCodeBlocks(addCodeBlocks(m.content))}</ui-assistant-message>
      </li>`
      : `
      <li id="${m.id}-${m.role}" class="flex justify-content-end">
        <ui-user-message>${addInlineCodeBlocks(addCodeBlocks(m.content))}</ui-user-message>
      </li>`
  }).join('')

  return html`
    <ol class="list-none grid grid-col gap0" id="${instanceID}">
      ${messages.length ? messagesMarkup : ''}
    </ol>
  `
}
