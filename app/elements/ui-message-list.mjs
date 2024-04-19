export default function MessageList ({ html, state }) {
  const { store } = state
  const { messages = [] } = store

  function renderCode (message) {
    const fenceRegex = /```(\w*)\n([\s\S]*?)\n```/g

    return message.replace(fenceRegex, (match, lang, code) => {
      return `<pre><code class="hljs ${lang ? lang : ''}">${code.trim()}</code></pre>`
    })
  }

  const messagesMarkup = messages.map(m => {
    return m.role === 'assistant'
      ? `
      <li id="${m.id}=${m.role}" class="flex justify-content-start">
        <ui-assistant-message>${renderCode(m.content)}</ui-assistant-message>
      </li>`
      : `
      <li id="${m.id}=${m.role}" class="flex justify-content-end">
        <ui-user-message>${m.content}</ui-assistant-message>
      </li>`
  }).join('')

  return html`
    <ol class="list-none grid grid-col gap0">
      ${messages.length ? messagesMarkup : ''}
    </ol>
  `
}
