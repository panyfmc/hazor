const excluirRepository = require('../repositories/excluir-repository')
const alunoRepository = require('../repositories/aluno-repository')

async function excluir(id) {
    const aluno = await alunoRepository.buscarPorId(id)
    if(!aluno) {
        throw new Error("Aluno não encontrado")
    }
    if(aluno.Ativo) {
        throw new Error("Só pode excluir alunos inativos")
    }
    await excluirRepository.excluir(id)
}

module.exports = {
    excluir
}