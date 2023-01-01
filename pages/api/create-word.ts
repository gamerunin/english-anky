import { NextApiHandler } from 'next'
import { query } from '@/lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { question, answer, repeats,  wrongs, category_id } = req.body
  try {
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: '`question` and `answer` are both required' })
    }

    const results = await query(
      `
      INSERT INTO words (question, answer, repeats,  wrongs, category_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [question, answer, repeats,  wrongs, category_id]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
