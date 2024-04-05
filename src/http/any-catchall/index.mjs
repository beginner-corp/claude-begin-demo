import arc from '@architect/functions'
import { createHash } from 'node:crypto'

const hash = input => createHash('sha256').update(input).digest('hex')
function rando () {
  let seed = Math.random().toString().split('.')[1]
  return hash(seed).substring(0, 10)
}
let data

export let handler = arc.http(_handler)

async function _handler (req) {
  if (!data) data = await arc.tables()

  let { session } = req
  if (!req.session.accountID) {
    session.accountID = rando()
  }
  let { accountID } = session

  let dataID = rando()
  let nav = ''
  let history = ''

  if (req.rawPath.startsWith('/d/')) {
    dataID = req.rawPath.split('/d/')[1]
    let result = await data.data.get({ accountID, dataID })
    if (!result) return {
      statusCode: 302,
      headers: { location: '/' },
    }
    history = result.messages
      .sort((a, b) => a < b ? -1 : 1)
      .map(msg => {
        let from
        if (msg.role === 'user') from = 'You'
        if (msg.role === 'assistant') from = 'Claude'
        return `<div class="margin-bottom-8">${from}: ${msg.content}</div>`
      })
      .filter(Boolean).join('\n')
  }

  let previousData = await data.data.query({
    KeyConditionExpression: '#accountID = :accountID',
    ExpressionAttributeNames: { '#accountID': 'accountID' },
    ExpressionAttributeValues: { ':accountID': accountID },
  })
  if (previousData.Items.length) {
    let items = previousData.Items
      .sort((a, b) => a.updated < b.updated ? 1 : -1)
      .map(item => {
        let snippet = item.messages[0].content.substring(0, 10) + '...'
        return `<section id="previous_chat"><a href="/d/${item.dataID}">${snippet}</a></section>`
      })
      .join('\n')
    nav = `
  <aside id="sidebar">
    ${items}
  </aside>`
  }

  return {
    statusCode: 200,
    session,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8',
    },
    body: /* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Architect</title>
  <style>
     * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; } .max-width-320 { max-width: 20rem; } .max-width-960 { max-width: 60rem; } .margin-left-8 { margin-left: 0.5rem; } .margin-bottom-16 { margin-bottom: 1rem; } .margin-bottom-8 { margin-bottom: 0.5rem; } .padding-32 { padding: 2rem; } .color-grey { color: #333; } .color-black-link:hover { color: black; }
  </style>
</head>
<body class="padding-32">
  <div class="max-width-960">
    ${nav}
    <div class="margin-left-8">
    <div class="margin-bottom-16">

        <div id="claude">
          <!-- Claude messages go here -->
          ${history}
        </div>

        <p class="margin-bottom-8">
          <input type="text" id="userInput" placeholder="Hey, Claudius.">
          <button type="button" id="sendMessage">Send message</button>
        </p>

        </div>
    </div>
  </div>
  <script type="module">
    import { init, connect, send } from '/_static/ws.js'
    sessionStorage.setItem('accountID', '${accountID}')
    sessionStorage.setItem('dataID', '${dataID}')
    init()
    connect('${process.env.ARC_WSS_URL}')
  </script>
</body>
</html>
`,
  }
}
