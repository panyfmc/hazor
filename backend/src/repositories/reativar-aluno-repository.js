const {sql} = require('../config/database')

async function reativar(id, dataReingresso) {

    const result = await new sql.Request()
        .input('id', sql.Int, id)
        .input(
            'dataReingresso',
            sql.Date,
            dataReingresso
        )
        .query(`
            UPDATE Alunos
            SET
                Ativo = 1,
                DataReingresso = GETDATE()
            WHERE Id = @id
        `)
    return result.recordset
}

module.exports = {
    reativar
}