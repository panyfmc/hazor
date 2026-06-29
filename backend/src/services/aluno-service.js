const alunoRepository = require('../repositories/aluno-repository')
const atualizarRepository = require('../repositories/atualizar-aluno-repository')
const inativarRepository = require('../repositories/inativar-aluno-repository')
const reativarRepository = require('../repositories/reativar-aluno-repository')
const alunoGrupoRepository = require('../repositories/aluno-grupo-repository')
const presencaRepository = require('../repositories/presenca-repository')
const entregaRepository = require('../repositories/entrega-repository')
const aulaRepository = require('../repositories/aula-repository')
const atividadeRepository = require('../repositories/atividade-repository')
const gp_oficina = 1

async function listar() {
    const alunos = await alunoRepository.listar()

    const totalAulas = await aulaRepository.contar()
    const totalAtividades = await atividadeRepository.contar()

    const presencas = await presencaRepository.contarPorAluno()
    const entregas = await entregaRepository.contarPorAluno()

    const mapaPresencas = new Map(
        presencas.map(p => [p.AlunoId, p.Total])
    )

    const mapaEntregas = new Map(
        entregas.map(e => [e.AlunoId, e.Total])
    )

    return alunos.map(aluno => ({
        ...aluno,

        presencas: mapaPresencas.get(aluno.Id) ?? 0,
        totalAulas,

        entregas: mapaEntregas.get(aluno.Id) ?? 0,
        totalAtividades
    }))
}

async function criar(aluno) {
    const alunoCriado = await alunoRepository.criar(aluno) 
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