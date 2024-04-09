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

  return {
    json: {
      conversation,
    },
  }
}
