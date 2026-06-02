async function reativar(id, dataReingresso) {

    await sql
        .request()
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
                DataReingresso = @dataReingresso
            WHERE Id = @id
        `)
}