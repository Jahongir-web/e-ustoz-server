const { Pool } = require('pg')

const pool = new Pool({
    connectionString: 'postgres://cgvzimur:cyyO9DzEamrPq-7QEkY3EFIX7CbEuu9n@john.db.elephantsql.com/cgvzimur'
})

const rows = async (query, ...params) => {

    const client = await pool.connect()

    try {
        const { rows } = await client.query(query, params)
        return rows
    } catch (error) {
        console.log(error.message)
    } finally {
        client.release()
    }
}


module.exports.rows = rows
