const repository = require('../repositories/temporada-repository')

async function listar() {
    return await repository.listar()
}

async function criar(temporada) {
    return await repository.criar(temporada)
}

async function buscarAtiva() {
    return await repository.buscarAtiva()
}

async function ativar(id) {           
    return await repository.ativar(id)
}

async function excluir(id) {
    return await repository.excluir(id)
}

module.exports = {
    listar,
    criar,
    buscarAtiva,
    ativar,
    excluir
}