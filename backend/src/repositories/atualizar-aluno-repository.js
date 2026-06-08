const { sql } = require('../config/database')

async function atualizar(id, aluno) {
    await new sql.Request()
        .input('id', sql.Int, id)
        .input('nomeCompleto', sql.NVarChar(150), aluno.nomeCompleto)
        .input('igrejaId', sql.Int, aluno.igrejaId)
        .input('grupoId', sql.Int, aluno.grupoId)
        .input('ativo', sql.Bit, aluno.ativo) 
        .input('dataInativacao', sql.Date, aluno.dataInativacao ? aluno.dataInativacao : null)
        .query(`
            UPDATE Alunos
            SET
                NomeCompleto = @nomeCompleto,
                IgrejaId = @igrejaId,
                GrupoId = @grupoId,
                Ativo = @ativo,
                DataInativacao = @dataInativacao
            WHERE Id = @id
        `)
}

module.exports = {
    atualizar
}