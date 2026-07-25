const repository = require('../repositories/departamento-repository')

async function listar() {
    return await repository.listar()
}

module.exports = {
    listar
}