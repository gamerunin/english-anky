import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ message: '`id` required' })
    }
    // @ts-ignore
    if (typeof parseInt(id) !== 'number') {
      return res.status(400).json({ message: '`id` must be a number' })
    }
    const results = await query(
      `
      SELECT *
      FROM categories
      WHERE id = ?
    `,
      id
    )

    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
