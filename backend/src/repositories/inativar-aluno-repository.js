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
        `)
}

module.exports = {
    inativar
}