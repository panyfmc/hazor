const alunoRepository = require('../repositories/aluno-repository')
const atualizarRepository = require('../repositories/atualizar-aluno-repository')
const inativarRepository = require('../repositories/inativar-aluno-repository')
const reativarRepository = require('../repositories/reativar-aluno-repository')
const alunoGrupoRepository = require('../repositories/aluno-grupo-repository')
const gp_oficina = 1
async function listar() {
    return await alunoRepository.listar()
}

async function criar(aluno) {
    const alunoCriado = await alunoRepository.criar(aluno) 
    // console.log(alunoCriado)
    await alunoGrupoRepository.criar(
        alunoCriado.Id,
        aluno.grupoId,
        aluno.dataIngresso
    )
    return alunoCriado
}

async function buscarPorId(id) {
    return await alunoRepository.buscarPorId(id)
}

async function atualizar(id, aluno) {
    const alunoAtual = await alunoRepository.buscarPorId(id)

    if(alunoAtual.GrupoId !== aluno.grupoId) {
        await alunoGrupoRepository.finalizarGrupo(
            id,
            alunoAtual.GrupoId,
            aluno.dataIngresso
        )
        
        await alunoGrupoRepository.criar(
            id,
            aluno.grupoId,
            aluno.dataIngresso
        )
    } else {
        await alunoGrupoRepository.atualizarDataIngresso(
            id,
            aluno.grupoId,
            aluno.dataIngresso
        )
    }
    await atualizarRepository.atualizar(id, aluno)
}

async function inativar(id) {
   await inativarRepository.inativar(id)
}

async function reativar(id) {
    await reativarRepository.reativar(id)

    await alunoGrupoRepository.criar(
        id,
        gp_oficina, // Oficina
        new Date()
    )
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    inativar,
    reativar
}