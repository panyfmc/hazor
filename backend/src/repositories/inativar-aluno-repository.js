async function inativar(id, dataInativacao) {

    await sql
        .request()
        .input('id', sql.Int, id)
        .input(
            'dataInativacao',
            sql.Date,
            dataInativacao
        )
        .query(`
            UPDATE Alunos
            SET
                Ativo = 0,
                DataInativacao = @dataInativacao
            WHERE Id = @id
        `)
}