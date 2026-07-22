const repository = require('../repositories/temporada-repository')

async function listar() {
    return await repository.listar()
}

async function criar(temporada) {
    return await repository.criar(temporada)
}

async function buscarPorId(id) {
    return await repository.buscarPorId(id)
}

async function atualizar(id, temporada) {
    const temporadaTrue = await repository.buscarPorId(id)
    if(!temporadaTrue) {
        throw new Error('Temporada não encontrada')
    }  
    if (
        temporada.dataFim && new Date(temporada.dataFim) < new Date(temporada.dataInicio)
    ) {
        throw new Error('A data fim deve ser maior ou igual a data início.')
    }
    await repository.atualizar(id, temporada)
}

async function excluir(id) {
    return await repository.excluir(id)
}



module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir
}