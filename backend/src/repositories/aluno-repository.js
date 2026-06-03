const {sql} = require('../config/database')


async function listar() {

    const result = await sql.query(`
        SELECT
            A.Id,
            A.NomeCompleto,
            I.Nome AS Igreja,
            R.Nome AS Regiao,
            G.Nome AS Grupo,
            A.DataIngresso
        FROM Alunos A
        INNER JOIN Igrejas I
            ON I.Id = A.IgrejaId
        INNER JOIN Regioes R
            ON R.Id = I.RegiaoId
        INNER JOIN Grupos G
            ON G.Id = A.GrupoId
    `)

    return result.recordset
}

async function buscarPorId(id) {
    const result = await new sql.Request().input('id', sql.Int, id).query(`
        SELECT * FROM Alunos
        WHERE Id = @id

        `)
    return result.recordset[0]
}

async function criar(aluno) {

    const result = await new sql.Request()

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

module.exports = {
    listar,
    buscarPorId,
    criar
}