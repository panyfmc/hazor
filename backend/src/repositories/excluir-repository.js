const {sql} = require('../config/database')

async function excluir(id) {
    await new sql.Request().input('id', sql.Int, id)
    .query(`
        DELETE FROM AlunoGrupos
        WHERE AlunoId = @id
        
        DELETE FROM Alunos
        WHERE 
            Id = @id
            AND Ativo = 0

    `)
}

module.exports = {
    excluir
}