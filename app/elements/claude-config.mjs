export default function ClaudeConfig ({ html, state }) {
  const { store } = state
  const { accountID, dataID } = store

  return html`
    <script type="module">
      window.sessionStorage.setItem('accountID', '${accountID}')
      window.sessionStorage.setItem('dataID', '${dataID}')
    </script>
  `
}
