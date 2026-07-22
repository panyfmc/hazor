const {sql} = require('../config/database')

async function listar() {
    const result = await new sql.Request()
    .query(`
        SELECT *
        FROM Presencas
        WHERE DeletedAt IS NULL
    `)
    return result.recordset
}

async function buscarPorId(id) {
    const result = await new sql.Request().input('id', sql.Int, id)
    .query(`
        SELECT * FROM Presencas
        WHERE Id = @id
            AND DeletedAt IS NULL
    `)
    return result.recordset[0]
}

async function criar(presenca) {

    const request = new sql.Request();

    request
        .input('oficinaId', sql.Int, presenca.oficinaId)
        .input('alunoId', sql.Int, presenca.alunoId);

    const existe = await request.query(`
        SELECT Id, DeletedAt
        FROM Presencas
        WHERE OficinaId = @oficinaId
          AND AlunoId = @alunoId
    `);

    if (existe.recordset.length > 0) {

        if (existe.recordset[0].DeletedAt !== null) {

            request.input('id', sql.Int, existe.recordset[0].Id);

            await request.query(`
                UPDATE Presencas
                SET DeletedAt = NULL
                WHERE Id = @id
            `);
        }

        return existe.recordset[0];
    }

    const result = await request.query(`
        INSERT INTO Presencas
        (
            OficinaId,
            AlunoId
        )
        OUTPUT INSERTED.*
        VALUES
        (
            @oficinaId,
            @alunoId
        )
    `);

    return result.recordset[0];
}

async function listarPorOficina(oficinaId) {
    const result = await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            SELECT
                p.Id,
                a.Id AS AlunoId,
                a.NomeCompleto
            FROM Presencas p
            INNER JOIN Alunos a
                ON a.Id = p.AlunoId
            WHERE p.OficinaId = @oficinaId
                AND p.DeletedAt IS NULL
            ORDER BY a.NomeCompleto
        `)

    return result.recordset
}

async function excluir(id) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            UPDATE Presencas
            SET DeletedAt = GETUTCDATE()
            WHERE Id = @id
                AND DeletedAt IS NULL
        `)
}

async function excluirPorOficina(oficinaId) {
    await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            UPDATE Presencas
            SET DeletedAt = GETUTCDATE()
            WHERE OficinaId = @oficinaId
                AND DeletedAt IS NULL
        `)
}

async function listarIdsPorOficina(oficinaId) {

    const result = await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            SELECT AlunoId
            FROM Presencas
            WHERE OficinaId = @oficinaId
                AND DeletedAt IS NULL
        `)

    return result.recordset
}

async function contarPorAluno() {
    const result = await new sql.Request().query(`
        SELECT
            AlunoId,
            COUNT(*) AS Total
        FROM Presencas
            WHERE DeletedAt IS NULL
        GROUP BY AlunoId
    `)

    return result.recordset
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    listarPorOficina,
    excluir,
    excluirPorOficina,
    listarIdsPorOficina,
    contarPorAluno
}