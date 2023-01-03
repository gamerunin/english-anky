import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { title } = req.body
  try {
    if (!title) {
      return res
        .status(400)
        .json({ message: '`title` required' })
    }

    const results = await query(
      `
      INSERT INTO categories (title)
      VALUES (?)
      `,
      [title]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
