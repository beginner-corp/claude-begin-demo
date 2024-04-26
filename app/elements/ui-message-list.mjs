export default function MessageList({ html, state }) {
  const { store, instanceID } = state
  const { messages = [] } = store

  const messagesMarkup = messages.map(m => {
    return m.role === 'assistant'
      ? `
      <li id="${m.id}-${m.role}" class="flex justify-content-start">
        <ui-assistant-message>${m.content}</ui-assistant-message>
      </li>`
      : `
      <li id="${m.id}-${m.role}" class="flex justify-content-end">
        <ui-user-message>${m.content}</ui-assistant-message>
      </li>`
  }).join('')

  return html`
    <ol class="list-none grid grid-col gap0" id="${instanceID}">
      ${messages.length ? messagesMarkup : ''}
    </ol>
  `
}
