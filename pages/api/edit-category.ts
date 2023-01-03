import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { id, title } = req.body
  try {
    if (!id || !title) {
      return res
        .status(400)
        .json({ message: '`id`,`title` are all required' })
    }

    const results = await query(
      `
      UPDATE categories
      SET title = ?
      WHERE id = ?
      `,
      [title, id]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
