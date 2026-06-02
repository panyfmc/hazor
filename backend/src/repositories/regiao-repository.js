const {sql} = require('../config/database')

async function listar() {

    const result = await sql.query(`
        SELECT
            Id,
            Nome
        FROM Regioes
        ORDER BY Nome
    `)
    return result.recordset
}

module.exports = {
    listar
}