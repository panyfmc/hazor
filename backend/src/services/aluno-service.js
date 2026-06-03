const alunoRepository = require('../repositories/aluno-repository')
const atualizarRepository = require('../repositories/atualizar-aluno-repository')
const inativarRepository = require('../repositories/inativar-aluno-repository')
const reativarRepository = require('../repositories/reativar-aluno-repository')

async function listar() {
    return await alunoRepository.listar()
}

async function criar(aluno) {
    return await alunoRepository.criar(aluno)
}

async function buscarPorId(id) {
    return await alunoRepository.buscarPorId(id)
}




async function atualizar(id, aluno) {
    return await atualizarRepository.atualizar(id, aluno)
}

async function inativar(id) {
    return await inativarRepository.inativar(id)
}

async function reativar(id) {
    return await reativarRepository.reativar(id)
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    inativar,
    reativar
}