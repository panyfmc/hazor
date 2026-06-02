const alunoRepository = require('../repositories/aluno-repository')

async function listar() {
    return await alunoRepository.listar()
}

async function criar(aluno) {
    return await alunoRepository.criar(aluno)
}

async function buscarPorId(id) {
    return await alunoRepository.buscarPorId(id)
}

module.exports = {
    listar,
    criar,
    buscarPorId
}