const {sql} = require('../config/database')

async function listar(temporadaId) {
    const request = new sql.Request();
    
    let query = `
        SELECT
            O.*,
            COUNT(P.Id) AS TotalPresentes
        FROM Oficinas O
        LEFT JOIN Presencas P
            ON P.OficinaId = O.Id
    `;

    // Se vier uma temporada do Front, aplica o filtro antes do GROUP BY
    if (temporadaId) {
        query += ` WHERE O.TemporadaId = @temporadaId `;
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
    `)
    return result.recordset[0]
}

async function atualizar(id, oficina) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .input('temporadaId', sql.Int, oficina.temporadaId)
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
        `)
}

async function excluir(id) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM Oficinas
            WHERE Id = @id
        `)
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir
}