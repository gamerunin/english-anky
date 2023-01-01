import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { category, not_complete } = req.query;
  try {
    let results = {};
    if(category) {
      if(not_complete) {
        results = await query(`
        SELECT *
        FROM words
        WHERE category_id = ? AND repeats > 0
        ORDER BY id DESC
      `, category)
      } else {
        results = await query(`
        SELECT *
        FROM words
        WHERE category_id = ?
        ORDER BY id DESC
      `, category)
      }
    } else {
      results = await query(`
        SELECT *
        FROM words
        ORDER BY id DESC
      `)
    }

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
