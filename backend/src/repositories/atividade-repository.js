const { sql } = require('../config/database')

async function criar(oficinaId) {
    console.log(oficinaId)
    const result = await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            INSERT INTO Atividades
            (
                OficinaId,
                Encerrada
            )
            OUTPUT INSERTED.*
            VALUES
            (
                @oficinaId,
                0
            )
        `)

    return result.recordset[0]
}

async function buscarPorOficina(oficinaId) {

    const result = await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            SELECT *
            FROM Atividades
            WHERE OficinaId = @oficinaId
        `)

    return result.recordset[0]
}

async function excluir(id) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM Atividades
            WHERE Id = @id
        `)
}

async function encerrar(id) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            UPDATE Atividades
            SET Encerrada = 1
            WHERE Id = @id
        `)
}

async function contar() {
    const result = await new sql.Request().query(`
        SELECT COUNT(*) AS Total
        FROM Atividades
    `)

    return result.recordset[0].Total
}

module.exports = {
    criar,
    buscarPorOficina,
    excluir,
    encerrar,
    contar
}
