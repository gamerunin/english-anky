import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT c.*,
             (SELECT COUNT(*) FROM words as w WHERE w.category_id = c.id AND w.repeats = 0) as complete,
             (SELECT COUNT(*) FROM words as w WHERE w.category_id = c.id AND w.repeats > 0) as not_complete
      FROM categories as c
      ORDER BY id DESC
  `)

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
