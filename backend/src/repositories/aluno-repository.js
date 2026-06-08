const {sql} = require('../config/database')

async function listar() {
    const result = await sql.query(`
        SELECT
            A.Id,
            A.NomeCompleto,
            I.Nome AS Igreja,
            R.Nome AS Regiao,
            G.Nome AS Grupo,
            AG.DataIngresso,
            A.Ativo,
            A.DataInativacao,
            I.RegiaoId,
            A.IgrejaId,
            A.GrupoId   
        FROM Alunos A
        INNER JOIN Igrejas I
            ON I.Id = A.IgrejaId
        INNER JOIN Regioes R
            ON R.Id = I.RegiaoId
        INNER JOIN Grupos G
            ON G.Id = A.GrupoId
        INNER JOIN AlunoGrupos AG 
            ON AG.AlunoId = A.Id
            AND AG.GrupoId = A.GrupoId
            AND AG.DataFim IS NULL
    `)
    return result.recordset
}

async function buscarPorId(id) {
    const result = await new sql.Request().input('id', sql.Int, id)
    .query(`
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

    .query(`
        INSERT INTO Alunos
        (
            NomeCompleto,
            IgrejaId,
            GrupoId
        )
        OUTPUT INSERTED.Id
        VALUES
        (
            @nomeCompleto,
            @igrejaId,
            @grupoId
        )
    `)
    return result.recordset[0]
}


module.exports = {
    listar,
    buscarPorId,
    criar
}