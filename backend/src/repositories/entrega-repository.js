const {sql} = require('../config/database')

async function criarEntrega(atividadeId, alunoId, transaction = null) {

    const request = transaction
        ? new sql.Request(transaction)
        : new sql.Request()

    await request
        .input('atividadeId', sql.Int, atividadeId)
        .input('alunoId', sql.Int, alunoId)
        .query(`
            INSERT INTO Entregas
            (
                AtividadeId,
                AlunoId
            )
            VALUES
            (
                @atividadeId,
                @alunoId
            )
        `)

}

async function removerEntrega(atividadeId, alunoId) {
    await new sql.Request()
        .input('atividadeId', sql.Int, atividadeId)
        .input('alunoId', sql.Int, alunoId)
        .query(`
            DELETE FROM Entregas
            WHERE AtividadeId=@atividadeId
            AND AlunoId=@alunoId
        `)
}

async function listarPorAtividade(id) {
    const result = await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            SELECT
                A.Id,
                A.NomeCompleto
            FROM Entregas E
            INNER JOIN Alunos A
                ON A.Id=E.AlunoId
            WHERE E.AtividadeId=@id
            ORDER BY A.NomeCompleto
        `)
    return result.recordset
}

async function excluirPorAtividade(atividadeId, transaction = null) {

    const request = transaction
        ? new sql.Request(transaction)
        : new sql.Request()

    await request
        .input('atividadeId', sql.Int, atividadeId)
        .query(`
            DELETE FROM Entregas
            WHERE AtividadeId=@atividadeId
        `)

}

module.exports = {
    criarEntrega,
    removerEntrega,
    listarPorAtividade,
    excluirPorAtividade
}