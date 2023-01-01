const path = require('path')
const envPath = path.resolve(process.cwd(), '.env')

console.log({ envPath })

require('dotenv').config({ path: envPath })
const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
})

async function query(q) {
  try {
    const results = await db.query(q)
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}

// Create "entries" table if doesn't exist
async function migrate() {
  try {
    // Создание таблицы words
    await query(`
        CREATE TABLE IF NOT EXISTS words (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT NULL,
          question TEXT NULL,
          answer TEXT NULL,
          wrongs INT NULL,
          repeats INT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `)
    // Создание таблицы categories
    await query(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title TEXT NULL
        )
    `)
    console.log('migration ran successfully')
  } catch (e) {
    console.error('could not run migration, double check your credentials.', e)
    process.exit(1)
  }
}

migrate().then(() => process.exit())
