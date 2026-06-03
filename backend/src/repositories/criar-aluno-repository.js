const {sql} = require('../config/database')

async function criar(aluno) {

    const result = await sql
        .request()
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
        .input(
            'dataIngresso',
            sql.Date,
            aluno.dataIngresso
        )
        .query(`
            INSERT INTO Alunos
            (
                NomeCompleto,
                IgrejaId,
                GrupoId,
                DataIngresso
            )
            VALUES
            (
                @nomeCompleto,
                @igrejaId,
                @grupoId,
                @dataIngresso
            )
        `)
    return result.recordset
}