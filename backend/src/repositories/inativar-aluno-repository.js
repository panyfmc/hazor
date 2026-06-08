const {sql} = require('../config/database')

async function inativar(id) {

    await new sql.Request()
        .input('id', sql.Int, id)
        .query(`
            UPDATE Alunos
            SET
                Ativo = 0,
                DataInativacao = GETDATE()
            WHERE Id = @id

            UPDATE AlunoGrupos
            SET
                DataFim = CAST(GETDATE() AS DATE)
            WHERE
                AlunoId = @id
            AND DataFim IS NULL
        `)
}

module.exports = {
    inativar
}