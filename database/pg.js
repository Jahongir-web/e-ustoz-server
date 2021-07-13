const { Pool } = require('pg')

const pool = new Pool({
    connectionString: 'postgres://awxchufm:3i72_G4F8313srmARE48OzAoNo1LwCIb@john.db.elephantsql.com/awxchufm'
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