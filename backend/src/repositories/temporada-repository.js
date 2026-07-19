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

async function buscarAtiva() {
    const result = await new sql.Request().query(`
        SELECT TOP 1 *
        FROM Temporadas
        WHERE Ativa = 1 
          AND DeletedAt IS NULL
        ORDER BY DataInicio DESC
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

async function criar(temporada) {
    const request = new sql.Request()
    
    request.input('nome', sql.VarChar(100), temporada.nome)
    request.input('inicio', sql.Date, temporada.dataInicio)
    request.input('fim', sql.Date, temporada.dataFim || null)

    const result = await request.query(`
        INSERT INTO Temporadas (Nome, DataInicio, DataFim, Ativa)
        OUTPUT INSERTED.*
        VALUES (@nome, @inicio, @fim, 0)
    `)

    return result.recordset[0]
}

async function ativar(id) {
    const transaction = new sql.Transaction()
    
    try {
        await transaction.begin()
        const req = new sql.Request(transaction)
        req.input('id', sql.Int, id)

        await req.query(`
            UPDATE Temporadas SET Ativa = 0 WHERE DeletedAt IS NULL;
            UPDATE Temporadas SET Ativa = 1 WHERE Id = @id AND DeletedAt IS NULL;
        `)

        await transaction.commit()
        return true
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function excluir(id) {
    const transaction = new sql.Transaction()
    
    try {
        await transaction.begin()
        const req = new sql.Request(transaction)
        req.input('id', sql.Int, id)

        // Verifica se a temporada que será excluída é a ativa
        const info = await req.query(`
            SELECT Ativa 
            FROM Temporadas 
            WHERE Id = @id AND DeletedAt IS NULL
        `)

        const eraAtiva = info.recordset[0]?.Ativa === true

        // Realiza o Soft Delete
        await req.query(`
            UPDATE Temporadas 
            SET DeletedAt = GETUTCDATE()
            WHERE Id = @id

            UPDATE Oficinas 
            SET DeletedAt = GETUTCDATE()
            WHERE TemporadaId = @id
        `)

        // Se era a ativa, ativa automaticamente a próxima mais recente
        if (eraAtiva) {
            await req.query(`
                UPDATE Temporadas 
                SET Ativa = 1
                WHERE Id = (
                    SELECT TOP 1 Id 
                    FROM Temporadas 
                    WHERE DeletedAt IS NULL 
                    ORDER BY DataInicio DESC, Nome DESC
                )
            `)
        }

        await transaction.commit()
        return { sucesso: true, eraAtiva }
    } catch (error) {
        await transaction.rollback()
        console.error("Erro ao excluir temporada:", error)
        throw error
    }
}

module.exports = {
    listar,
    criar,
    buscarAtiva,
    buscarPorId,
    ativar,
    excluir
}