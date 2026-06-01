const { sql } = require('../config/database');

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
    `);

    return result.recordset;
}

module.exports = {
    listar
};