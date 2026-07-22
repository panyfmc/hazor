const { sql } = require('../config/database')

async function listar() {
    const result = await new sql.Request().query(`
        SELECT *
        FROM Temporadas
        WHERE DeletedAt IS NULL
        ORDER BY DataInicio DESC, Nome DESC
    `)
    return result.recordset
}

async function criar(temporada) {
    const request = new sql.Request()
    request.input('nome', sql.NVarChar(30), temporada.nome)
    request.input('inicio', sql.Date, temporada.dataInicio)
    request.input('fim', sql.Date, temporada.dataFim || null)

    const result = await request.query(`
        INSERT INTO Temporadas (Nome, DataInicio, DataFim)
        OUTPUT INSERTED.*
        VALUES (@nome, @inicio, @fim)
    `)

    return result.recordset[0]
}

async function buscarPorId(id) {
    const result = await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            SELECT * FROM Temporadas 
            WHERE Id = @id 
                AND DeletedAt IS NULL
        `)
    return result.recordset[0]
}

async function atualizar(id, temporada) {
    await new sql.Request() 
    .input('id', sql.Int, id)
    .input('nome', sql.NVarChar(30), temporada.nome)
    .input('inicio', sql.Date, temporada.dataInicio)
    .input('fim', sql.Date, temporada.dataFim || null)
    .query(`
        UPDATE Temporadas
        SET 
            Nome = @nome,
            DataInicio = @inicio,
            DataFim = @fim
        WHERE Id = @id
            AND DeletedAt IS NULL
    `)
}

async function excluir(id) {
    const transaction = new sql.Transaction()
    
    try {
        await transaction.begin()
        const req = new sql.Request(transaction)
        req.input('id', sql.Int, id)

        // Realiza o Soft Delete
        await req.query(`
            UPDATE Entregas
            SET DeletedAt = GETUTCDATE()
            WHERE AtividadeId IN (
                SELECT Id
                FROM Atividades
                WHERE OficinaId IN (
                    SELECT Id
                    FROM Oficinas
                    WHERE TemporadaId = @id
                )
            )
                AND DeletedAt IS NULL
                    
            UPDATE Presencas
            SET DeletedAt = GETUTCDATE()
            WHERE OficinaId IN (
                SELECT Id
                FROM Oficinas
                WHERE TemporadaId = @id
            )
                AND DeletedAt IS NULL

            UPDATE Atividades
            SET DeletedAt = GETUTCDATE()
            WHERE OficinaId IN (
                SELECT Id
                FROM Oficinas
                WHERE TemporadaId = @id
            )
                AND DeletedAt IS NULL

            UPDATE Oficinas 
            SET DeletedAt = GETUTCDATE()
            WHERE TemporadaId = @id
                AND DeletedAt IS NULL

            UPDATE Temporadas 
            SET DeletedAt = GETUTCDATE()
            WHERE Id = @id
                AND DeletedAt IS NULL

        `)

        await transaction.commit()
        return { sucesso: true }
    } catch (error) {
        await transaction.rollback()
        console.error("Erro ao excluir temporada:", error)
        throw error
    }
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir
}