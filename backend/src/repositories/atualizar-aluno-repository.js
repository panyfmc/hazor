const {sql} = require('../config/database')

async function atualizar(id, aluno) {

    await new sql
        .Request()
        .input('id', sql.Int, id)
        .input(
            'nomeCompleto',
            sql.NVarChar(150),
            aluno.nomeCompleto
        )
        .input(
            'igrejaId',
            sql.Int,
            aluno.igrejaId
        )
        .input(
            'grupoId',
            sql.Int,
            aluno.grupoId
        )
        .query(`
            UPDATE Alunos
            SET
                NomeCompleto = @nomeCompleto,
                IgrejaId = @igrejaId,
                GrupoId = @grupoId
            WHERE Id = @id
        `)
}

module.exports = {
    atualizar
}