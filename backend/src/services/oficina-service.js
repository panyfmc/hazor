const oficinaRepository = require('../repositories/oficina-repository')
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
    // 🌟 CORREÇÃO: Pegando TemporadaId de dentro do objeto 'dados'
    const oficina = await oficinaRepository.criar({
        temporadaId: dados.TemporadaId || dados.temporadaId, 
        departamentoId: dados.DepartamentoId || dados.departamentoId,
        dataAula: dados.DataAula || dados.dataAula,
        teveAtividade: dados.TeveAtividade !== undefined ? dados.TeveAtividade : dados.teveAtividade
    })

    // Garante a leitura de 'Presentes' maiúsculo ou minúsculo
    const listaPresentes = dados.Presentes || dados.presentes

    if (listaPresentes?.length > 0) {
        for (const alunoId of listaPresentes) {
            await presencaRepository.criar({
                oficinaId: oficina.Id || oficina.id,
                alunoId
            })
        }
    }
    
    // Garante a leitura de 'TeveAtividade'
    const teveAtiv = dados.TeveAtividade !== undefined ? dados.TeveAtividade : dados.teveAtividade
    if (teveAtiv) {
        await atividadeRepository.criar(oficina.Id || oficina.id)
    }
    return oficina
}

async function atualizar(id, dados) {
    const oficinaAtual = await oficinaRepository.buscarPorId(id)
    if (!oficinaAtual) {
        throw new Error('Oficina não encontrada')
    }

    const deptoId = dados.DepartamentoId !== undefined ? dados.DepartamentoId : dados.departamentoId
    const dtAula = dados.DataAula !== undefined ? dados.DataAula : dados.dataAula
    const tAtividade = dados.TeveAtividade !== undefined ? dados.TeveAtividade : dados.teveAtividade
    const listaPresentes = dados.Presentes || dados.presentes

    await oficinaRepository.atualizar(id, {
        departamentoId: deptoId ?? oficinaAtual.DepartamentoId,
        dataAula: dtAula ?? oficinaAtual.DataAula,
        teveAtividade: tAtividade ?? oficinaAtual.TeveAtividade
    })

    // Atualiza as presenças se a lista foi enviada
    if (listaPresentes) {
        await presencaRepository.excluirPorOficina(id)
        for (const alunoId of listaPresentes) {
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