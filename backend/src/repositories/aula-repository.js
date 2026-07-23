const {sql} = require('../config/database')

async function listar(temporadaId) {
    const request = new sql.Request();
    
    let query = `
        SELECT
            O.Id,
            O.TemporadaId,
            O.DepartamentoId,
            O.DataAula,
            O.TeveAtividade,
            COUNT(P.Id) AS TotalPresentes
        FROM Oficinas O
        LEFT JOIN Presencas P
            ON P.OficinaId = O.Id
            AND P.DeletedAt IS NULL
        WHERE O.DeletedAt IS NULL
    `;

    // Se vier uma temporada do Front, aplica o filtro antes do GROUP BY
    if (temporadaId) {
        query += ` AND O.TemporadaId = @temporadaId `;
        request.input('temporadaId', sql.Int, temporadaId);
    }

    query += `
        GROUP BY
            O.Id,
            O.TemporadaId,
            O.DepartamentoId,
            O.DataAula,
            O.TeveAtividade
        ORDER BY O.DataAula DESC
    `;

    const result = await request.query(query);
    return result.recordset;
}

async function criar(aula) {
    const result = await new sql.Request()
        .input('temporadaId', sql.Int, aula.temporadaId)
        .input('departamentoId', sql.Int, aula.departamentoId)
        .input('dataAula', sql.Date, aula.dataAula)
        .input('teveAtividade', sql.Bit, aula.teveAtividade)
        .query(`
            INSERT INTO Oficinas
            (
                TemporadaId,
                DepartamentoId,
                DataAula,
                TeveAtividade
            )
            OUTPUT INSERTED.*
            VALUES
            (
                @temporadaId,
                @departamentoId,
                @dataAula,
                @teveAtividade
            )
        `)
    return result.recordset[0]
}

async function buscarPorId(id) {
    const result = await new sql.Request().input('id', sql.Int, id)
    .query(`
        SELECT * FROM Oficinas
        WHERE Id = @id
            AND DeletedAt IS NULL
    `)
    return result.recordset[0]
}

async function atualizar(id, oficina) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .input('departamentoId', sql.Int, oficina.departamentoId)
        .input('dataAula', sql.Date, oficina.dataAula)
        .input('teveAtividade', sql.Bit, oficina.teveAtividade)
        .query(`
            UPDATE Oficinas
            SET
                DepartamentoId = ISNULL(@departamentoId, DepartamentoId),
                DataAula = ISNULL(@dataAula, DataAula),
                TeveAtividade = ISNULL(@teveAtividade, TeveAtividade)
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
        await req.query(`
            UPDATE Entregas
            SET DeletedAt = GETUTCDATE()
            WHERE AtividadeId IN (
                SELECT Id
                FROM Atividades
                WHERE OficinaId = @id
            )    

            UPDATE Atividades
            SET DeletedAt = GETUTCDATE()
            WHERE OficinaId = @id

            UPDATE Presencas
            SET DeletedAt = GETUTCDATE()
            WHERE OficinaId = @id

            UPDATE Oficinas
            SET DeletedAt = GETUTCDATE()
            WHERE Id = @id
        `)
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function contar() {
    const result = await new sql.Request().query(`
        SELECT COUNT(*) AS Total
        FROM Oficinas
        WHERE DeletedAt IS NULL
    `)

    return result.recordset[0].Total
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir,
    contar
}