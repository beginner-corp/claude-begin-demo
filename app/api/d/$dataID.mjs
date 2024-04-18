import arc from '@architect/functions'

export async function get (req) {
  const data = await arc.tables()

  const { accountID } = req.session
  const { dataID } = req.params

  const result = await data.lore.get({ accountID, dataID })

  if (!result) {
    return {
      statusCode: 302,
      headers: {
        location: '/',
      },
    }
  }

  const conversation = result.messages.sort((a, b) => a < b ? -1 : 1)

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
    json: {
      accountID,
      dataID,
      messages: conversation,
      previousSessions,
    },
  }
}
