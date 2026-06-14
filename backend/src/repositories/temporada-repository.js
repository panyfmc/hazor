const {sql} = require('../config/database')

async function listar() {
    const result = await new sql.Request()
    .query(`
        SELECT *
        FROM Temporadas
        ORDER BY DataInicio DESC
    `)
    return result.recordset
}

async function criar(temporada) {
    await new sql.Request()
        .input('nome', sql.VarChar, temporada.nome)
        .input('inicio', sql.Date, temporada.dataInicio)
        .input('fim', sql.Date, temporada.dataFim)
        .query(`
            UPDATE Temporadas
            SET Ativa = 0
            WHERE Ativa = 1;
            INSERT INTO Temporadas
            (
                Nome,
                DataInicio,
                DataFim,
                Ativa
            )
            VALUES
            (
                @nome,
                @inicio,
                @fim,
                1
            )
        `)
}

async function buscarAtiva() {
    const result = await new sql.Request()
    .query(`
        SELECT * 
        FROM Temporadas
        WHERE Ativa = 1    
    `)
    return result.recordset[0]
}

module.exports = {
    listar,
    criar,
    buscarAtiva
}