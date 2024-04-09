import arc from '@architect/functions'
import { createHash } from 'node:crypto'

const hash = input => createHash('sha256').update(input).digest('hex')

function rando () {
  let seed = Math.random().toString().split('.')[1]
  return hash(seed).substring(0, 10)
}
let data

export async function get (req) {
  if (!data) data = await arc.tables()

  let { session } = req
  if (!req.session.accountID) {
    session.accountID = rando()
  }
  let { accountID } = session
  let dataID = rando()

  let conversation
  let previousSessions

  let previousData = await data.lore.query({
    KeyConditionExpression: '#accountID = :accountID',
    ExpressionAttributeNames: { '#accountID': 'accountID' },
    ExpressionAttributeValues: { ':accountID': accountID },
  })

  if (previousData.Items.length) {
    previousSessions = previousData.Items.sort((a, b) => a.updated < b.updated ? 1 : -1)
  }

  return {
    statusCode: 200,
    session,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8',
    },
    json: {
      accountID,
      dataID,
      previousSessions,
      conversation,
    },
  }
}
