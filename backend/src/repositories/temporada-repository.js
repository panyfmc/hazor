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
        .input('fim', sql.Date, temporada.dataFim || null)
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

async function excluir(id) {
    const transaction = new sql.Transaction();
    
    try {
        await transaction.begin();

        // Criamos o request atrelado à transação
        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        await request.query(`
            -- 1º: Deleta as presenças vinculadas às oficinas/atividades dessa temporada
            DELETE FROM Presencas 
            WHERE OficinaId IN (SELECT Id FROM Oficinas WHERE TemporadaId = @id);

            -- 2º: Deleta as atividades vinculadas a essa temporada
            DELETE FROM Atividades 
            WHERE OficinaId IN (SELECT Id FROM Oficinas WHERE TemporadaId = @id);
            
            -- 3º: Deleta as oficinas vinculadas a essa temporada
            DELETE FROM Oficinas 
            WHERE TemporadaId = @id;

            -- 4º: Agora que os filhos sumiram, deletamos a Temporada pai
            DELETE FROM Temporadas 
            WHERE Id = @id;
        `);

        // Se tudo deu certo, consolida as alterações no banco
        await transaction.commit();

    } catch (error) {
        // Se der qualquer erro (ex: banco caiu, query errada), desfaz tudo
        await transaction.rollback();
        console.error("Erro ao excluir temporada e seus vínculos:", error);
        throw error; // Repassa o erro para tratar na rota/controller
    }
}

module.exports = {
    listar,
    criar,
    buscarAtiva,
    excluir
}