const atividadeRepository = require('../repositories/atividade-repository')
const entregaRepository = require('../repositories/entrega-repository')
const {sql} = require('../config/database')


async function criar(oficinaId) {
    return await atividadeRepository.criar(oficinaId)
}

async function buscarPorId(oficinaId) {
    return await atividadeRepository.buscarPorId(oficinaId)
}

async function listarEmAberto(temporadaId) {
    return await atividadeRepository.listarEmAberto(temporadaId)
}

async function encerrar(id) {
    return await atividadeRepository.encerrar(id)
}

async function excluir(id) {
    await entregaRepository.excluirPorAtividade(id)
    return await atividadeRepository.excluir(id)
}

async function criarEntrega(atividadeId, alunoId) {
    return await entregaRepository.criarEntrega(atividadeId, alunoId)
}

async function removerEntrega(atividadeId, alunoId) {
    return await entregaRepository.removerEntrega(atividadeId, alunoId)
}

async function listarPorAtividade(id) {
    return await entregaRepository.listarPorAtividade(id)
}

async function excluirPorAtividade(atividadeId) {
    return await entregaRepository.excluirPorAtividade(atividadeId)
}

async function editarEntregas(atividadeId, alunosIds) {

    const transaction = new sql.Transaction()

    try {

        await transaction.begin()

        await entregaRepository.excluirPorAtividade(
            atividadeId,
            transaction
        )

        for (const alunoId of alunosIds) {

            await entregaRepository.criarEntrega(
                atividadeId,
                alunoId,
                transaction
            )

        }

        await transaction.commit()

    } catch (error) {
        try {
            await transaction.rollback()
        } catch{}
        throw error
    }

}

module.exports = {
    criar,
    buscarPorId,
    listarEmAberto,
    encerrar,
    excluir,
    criarEntrega,
    removerEntrega,
    listarPorAtividade,
    excluirPorAtividade,
    editarEntregas
}