export default function PreviousSessions ({ html, state }) {
  const { store } = state
  const { previousSessions = [] } = store

  const sessionsMarkup = previousSessions.map(s => {
    let title = s.messages[0].content

    if (title.length > 32) title = `${title.substring(0, 32)}…`

    const updated = new Intl.DateTimeFormat('en-CA', {
      dateStyle: 'medium',
    }).format(s.updated)

    return `
    <li class="mbe0">
      <a href="/d/${s.dataID}" class="underline text-1 text0-lg">
        ${title}
      </a>
      <span class="block text-1">
        Updated: ${updated}
      </span>
    </li>`
  }).join('')

  return html`
    <nav class="p0">
      <h1 class="text-1 text0-lg font-bold mbe0">Previous conversations</h1>
      ${previousSessions.length ? `
        <ol class="list-none">
          ${sessionsMarkup}
        </ol>
      ` : `
        <p class="text-1">
          No previous conversations to show yet. Let's start one!
        </p>
      `}
    </nav>
  `
}
