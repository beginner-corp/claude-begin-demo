import arc from '@architect/functions'
import Anthropic from '@anthropic-ai/sdk'

const model = 'claude-3-opus-20240229'
const updatesPerSecond = 10
const freq = 1000 / updatesPerSecond
const enableAPI = process.env.ANTHROPIC_API_KEY
let data

export async function handler (req) {
  try {
    let connectionId = req.requestContext.connectionId
    let start = Date.now()
    let tokens = 0
    let updates = 0
    let payload, response, updated

    try {
      payload = JSON.parse(req.body)
    }
    catch {
      return { statusCode: 400 }
    }
    let { accountID, dataID, messages } = payload
    let last = messages[messages.length - 1]
    let { /* role, */ content, ts, id } = last

    async function send () {
      updates++
      try {
        await arc.ws.send({ id: connectionId, payload: response })
      }
      catch (err) {
        console.log('Swallowing ws.send error:', err)
      }
    }

    if (enableAPI) {
      const anthropic = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] })
      const stream = await anthropic.messages.stream({
        max_tokens: 1024,
        messages: messages.map(({ role, content }) => ({ role, content })),
        model,
      })

      stream.on('text', (textDelta, textSnapshot) => {
        tokens++
        updated = true
        response = {
          role: 'assistant',
          content: textSnapshot,
          ts,
          id,
          updated: Date.now(),
        }
      })

      let interval = setInterval(() => {
        if (updated) {
          updated = false
          send()
        }
      }, freq)

      await stream.finalMessage()
      clearInterval(interval)
      await send()
      console.log(`Claude (${model}) > WebSocket client (${connectionId}): ${tokens} tokens via ${updates} updates in ${Date.now() - start} ms`)
    }
    else {
      // Just reflect the input right back
      response = {
        role: 'assistant',
        content,
        ts,
        id,
        updated: Date.now(),
      }
      await send()
    }

    messages.push(response)

    if (!data) data = await arc.tables()
    let existing = await data.lore.get({ accountID, dataID })
    if (existing?.messages) {
      let existingIDs = existing.messages.map(({ id }) => id)
      let newMessages = messages.filter(({ id }) => !existingIDs.includes(id))
      if (newMessages.length) messages = existing.messages.concat(newMessages)
    }
    await data.lore.put({
      accountID,
      dataID,
      messages,
      updated: start,
    })

    return { statusCode: 200 }
  }
  catch (err) {
    console.error(err)
    return { statusCode: 500 }
  }
}
