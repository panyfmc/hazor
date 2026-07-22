const {sql} = require('../config/database')

async function criarEntrega(atividadeId, alunoId, transaction = null) {

    const request = transaction
        ? new sql.Request(transaction)
        : new sql.Request();

    request
        .input('atividadeId', sql.Int, atividadeId)
        .input('alunoId', sql.Int, alunoId);

    const existe = await request.query(`
        SELECT Id, DeletedAt
        FROM Entregas
        WHERE AtividadeId = @atividadeId
          AND AlunoId = @alunoId
    `);

    if (existe.recordset.length > 0) {

        if (existe.recordset[0].DeletedAt !== null) {

            request.input('id', sql.Int, existe.recordset[0].Id);

            await request.query(`
                UPDATE Entregas
                SET DeletedAt = NULL
                WHERE Id = @id
            `);
        }

        return existe.recordset[0];
    }

    await request.query(`
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
    `);
}

async function removerEntrega(atividadeId, alunoId) {
    await new sql.Request()
        .input('atividadeId', sql.Int, atividadeId)
        .input('alunoId', sql.Int, alunoId)
        .query(`
            UPDATE Entregas
            SET DeletedAt = GETUTCDATE()
            WHERE AtividadeId = @atividadeId
                AND AlunoId = @alunoId
                AND DeletedAt IS NULL
        `)
}

async function listarPorAtividade(id) {
    const result = await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            SELECT
                A.Id, A.NomeCompleto
            FROM Entregas E
            INNER JOIN Alunos A
                ON A.Id = E.AlunoId
            WHERE E.AtividadeId = @id
                AND E.DeletedAt IS NULL
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
            UPDATE Entregas
            SET DeletedAt = GETUTCDATE()
            WHERE AtividadeId=@atividadeId
                AND DeletedAt IS NULL
        `)

}

async function contarPorAluno() {
    const result = await new sql.Request().query(`
        SELECT
            AlunoId,
            COUNT(*) AS Total
        FROM Entregas
        WHERE DeletedAt IS NULL
        GROUP BY AlunoId
    `)

    return result.recordset
}

module.exports = {
    criarEntrega,
    removerEntrega,
    listarPorAtividade,
    excluirPorAtividade,
    contarPorAluno
}