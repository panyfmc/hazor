const {sql} = require('../config/database')

async function listar() {

    const result = await sql.query(`
        SELECT
            Id,
            Nome,
            RegiaoId
        FROM Igrejas
        ORDER BY Nome
    `)

    return result.recordset
}

async function listarPorRegiao(regiaoId) {

    const result = await new sql
        .Request()
        .input(
            'regiaoId',
            sql.Int,
            regiaoId
        )
        .query(`
            SELECT
                Id,
                Nome
            FROM Igrejas
            WHERE RegiaoId = @regiaoId
            ORDER BY Nome
        `)

    return result.recordset
}

module.exports = {
    listar,
    listarPorRegiao
}