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

async function buscarPorId(oficinaId) {

    const result = await new sql.Request()
        .input('oficinaId', sql.Int, oficinaId)
        .query(`
            SELECT *
            FROM Atividades
            WHERE OficinaId = @oficinaId
            ORDER BY Id DESC
        `)

    return result.recordset[0]
}

async function listarEmAberto(temporadaId) {
    const result = await new sql.Request()
        .input('temporadaId', sql.Int, temporadaId) 
        .query(`
            SELECT 
                A.Id,
                A.OficinaId,
                O.DataAula,
                O.DepartamentoId,
                COUNT (DISTINCT P.Id) AS Presencas,
                COUNT (DISTINCT EA.Id) AS Entregas
            FROM Atividades A
            INNER JOIN Oficinas O
                ON O.Id = A.OficinaId
            LEFT JOIN Presencas P
                ON P.OficinaId = O.Id
                
            LEFT JOIN Entregas EA
                ON EA.AtividadeId = A.Id
                
            WHERE 
                O.TemporadaId = @temporadaId
                AND A.Encerrada = 0
                
            GROUP BY
                A.Id,
                A.OficinaId,
                O.DataAula,
                O.DepartamentoId
        `)
        console.log("temporadaId recebido:", temporadaId)
    return result.recordset
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
    buscarPorId,
    listarEmAberto,
    excluir,
    encerrar,
    contar
}
