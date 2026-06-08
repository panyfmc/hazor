const {sql} = require('../config/database')

async function criar(alunoId, grupoId, dataIngresso) {
    await new sql.Request()
        .input('alunoId', sql.Int, alunoId)
        .input('grupoId', sql.Int, grupoId)
        .input('dataIngresso', sql.Date, dataIngresso)
        .query(`
            INSERT INTO AlunoGrupos
            (
                AlunoId,
                GrupoId,
                DataIngresso
            )
            VALUES
            (
                @alunoId,
                @grupoId,
                @dataIngresso
            )
        `)
}

async function finalizarGrupo(alunoId, grupoId, dataFim){
    await new sql.Request()
    .input("alunoId", sql.Int, alunoId)
    .input("grupoId", sql.Int, grupoId)
    .input('dataFim', sql.Date, dataFim)
    .query(`
        UPDATE AlunoGrupos
        SET DataFim = @dataFim
        WHERE
            AlunoId = @alunoId
        AND GrupoId = @grupoId
        AND DataFim IS NULL
    `)
}

async function finalizarGrupoAtual(alunoId) {
    await new sql.Request()
        .input('alunoId', sql.Int, alunoId)
        .query(`
            UPDATE AlunoGrupos
            SET DataFim = GETDATE()
            WHERE
                AlunoId = @alunoId
            AND DataFim IS NULL
        `)
}

async function atualizarDataIngresso(alunoId, grupoId, dataIngresso) {
    await new sql.Request()
        .input('alunoId', sql.Int, alunoId)
        .input('grupoId', sql.Int, grupoId)
        .input('dataIngresso', sql.Date, dataIngresso)
        .query(`
            UPDATE AlunoGrupos
            SET DataIngresso = @dataIngresso
            WHERE 
                AlunoId = @alunoId
            AND GrupoId = @grupoId
            AND DataFim IS NULL
        `)
        
}

module.exports = {
    criar,
    finalizarGrupo,
    finalizarGrupoAtual,
    atualizarDataIngresso
}