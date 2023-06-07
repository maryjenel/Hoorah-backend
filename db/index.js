const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = {
  async query (text, params) {
    // invocation timestamp for the query method
    const start = Date.now()
    try {
      console.log({ text, params })
      const res = await pool.query(text, params, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res)
        }
      })
      // time elapsed since invocation to execution
      const duration = Date.now() - start
      console.log(
        'executed query',
        { text, duration }
      )
      return res
    } catch (error) {
      console.log('error in query', { text })
      throw error
    }
  }
}
