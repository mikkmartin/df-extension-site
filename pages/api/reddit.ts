import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (_, res) => {
  return res.json({ html: 'html' })
}

export default handler
