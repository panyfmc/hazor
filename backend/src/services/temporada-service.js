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
module.exports = {
    listar,
    criar,
    buscarAtiva
}