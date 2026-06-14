const repository = require('../repositories/temporada-repository')

async function listar() {
    return await repository.listar()
}

async function criar(temporada) {
    await repository.criar(temporada)
}

module.exports = {
    listar,
    criar
}