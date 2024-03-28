import arc from '@architect/functions'
import Anthropic from '@anthropic-ai/sdk'

const model = 'claude-3-opus-20240229'
const updatesPerSecond = 10
const freq = 1000 / updatesPerSecond

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
    let last = payload[payload.length - 1]
    let { /* role, content, */ ts, id } = last

    let messages = payload.map(({ role, content }) => ({ role, content }))

    const anthropic = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] })
    const stream = await anthropic.messages.stream({
      max_tokens: 1024,
      messages,
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

    async function send () {
      updates++
      await arc.ws.send({ id: connectionId, payload: response })
    }

    await stream.finalMessage()
    clearInterval(interval)
    await send()
    console.log(`Claude (${model}) > WebSocket client (${connectionId}): ${tokens} tokens via ${updates} updates in ${Date.now() - start} ms`)

    return { statusCode: 200 }
  }
  catch (err) {
    console.error(err)
    return { statusCode: 500 }
  }
}
