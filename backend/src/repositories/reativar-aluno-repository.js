const {sql} = require('../config/database')
const gp_oficina = 1
async function reativar(id) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .input('grupoId', sql.Int, gp_oficina)  // 1 == grupo oficina
        .query(`
            UPDATE Alunos
            SET
                Ativo = 1,
                DataInativacao = NULL,
                grupoId = @grupoId
            WHERE Id = @id
        `)
}

module.exports = {
    reativar
}