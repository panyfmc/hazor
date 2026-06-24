const oficinaRepository = require('../repositories/aula-repository')
const presencaRepository = require('../repositories/presenca-repository')
const atividadeRepository = require('../repositories/atividade-repository')
const entregaRepository = require('../repositories/entrega-repository')
const temporadaRepository = require('../repositories/temporada-repository')

async function listar(temporadaId) {
    return await oficinaRepository.listar(temporadaId)
}

async function buscarPorId(id) {
    const oficina = await oficinaRepository.buscarPorId(id)
    if(!oficina) {
        throw new Error('Oficina não encontrada')
    }
    oficina.presentes = await presencaRepository.listarPorOficina(id)
    return oficina
}

async function criar(dados) {
    const temporada = await temporadaRepository.buscarAtiva()
    const oficina = await oficinaRepository.criar({
        temporadaId: temporada.Id,
        departamentoId: dados.departamentoId,
        dataAula: dados.dataAula,
        teveAtividade: dados.teveAtividade
    })

    if (dados.presentes?.length > 0) {
        for (const alunoId of dados.presentes) {
            await presencaRepository.criar({
                oficinaId: oficina.Id,
                alunoId
            })
        }
    }
    if (dados.teveAtividade) {
        await atividadeRepository.criar(oficina.Id)
    }
    return oficina
}

async function atualizar(id, dados) {
    const oficinaAtual = await oficinaRepository.buscarPorId(id)
    if (!oficinaAtual) {
        throw new Error('Oficina não encontrada')
    }

    await oficinaRepository.atualizar(id, {
        departamentoId: dados.departamentoId ?? oficinaAtual.DepartamentoId,
        dataAula: dados.dataAula ?? oficinaAtual.DataAula,
        teveAtividade: dados.teveAtividade ?? oficinaAtual.TeveAtividade
    })

    if (dados.presentes) {
        await presencaRepository.excluirPorOficina(id)
        for (const alunoId of dados.presentes) {
            await presencaRepository.criar({
                oficinaId: id,
                alunoId
            })
        }
    }
    return await oficinaRepository.buscarPorId(id)
}

async function excluir(id) {
    id = Number(id)
    const oficina = await oficinaRepository.buscarPorId(id)
    if(!oficina) {
        throw new Error('Oficina não encontrada')
    }
    await presencaRepository.excluirPorOficina(id)
    const atividade = await atividadeRepository.buscarPorOficina(id)
    if(atividade) {
        await entregaRepository.excluirPorAtividade(atividade.Id)
        await atividadeRepository.excluir(atividade.Id)
    }
    await oficinaRepository.excluir(id)
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir
}