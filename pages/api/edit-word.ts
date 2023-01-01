import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { id, question, answer, repeats,  wrongs, category_id } = req.body
  try {
    if (!id || !question || !answer) {
      return res
        .status(400)
        .json({ message: '`id`,`question`, and `answer` are all required' })
    }

    const results = await query(
      `
      UPDATE words
      SET question = ?, answer = ?, repeats = ?, wrongs = ?, category_id = ?
      WHERE id = ?
      `,
      [question, answer, repeats, wrongs, category_id, id]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
