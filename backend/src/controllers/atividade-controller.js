const atividadeService = require('../services/atividade-service')

async function criar(req, res) {
    const atividade = await atividadeService.criar(
        req.body.oficinaId
    )
    res.status(201).json(atividade)
}

async function buscarPorId(req, res) {
    const atividade = await atividadeService.buscarPorId(
        req.params.oficinaId
    )
    res.json(atividade)
}

async function listarEmAberto(req, res) {
    const atividade = await atividadeService.listarEmAberto(req.params.temporadaId)
    res.json(atividade)
}

async function encerrar(req, res) {
    await atividadeService.encerrar(req.params.id)
    res.sendStatus(204)
}

async function excluir(req, res) {
    await atividadeService.excluir(
        req.params.id
    )
    res.sendStatus(204)
}

async function criarEntrega(req, res) {
    const atividadeId = Number(req.params.atividadeId)
    const { alunoId } = req.body

    await atividadeService.criarEntrega(atividadeId, alunoId)
    res.sendStatus(201)
}

async function removerEntrega(req, res) {
    await atividadeService.removerEntrega(
        req.params.atividadeId,
        req.params.alunoId
    )
    res.sendStatus(204)
}

async function listarPorAtividade(req, res) {
    const entregas = await atividadeService.listarPorAtividade(
        req.params.atividadeId
    )
    res.json(entregas)
}

async function editarEntregas(req, res) {
    await atividadeService.editarEntregas(
        req.params.atividadeId,
        req.body.alunosIds
    )
    res.sendStatus(204)
}

module.exports = {
    criar,
    buscarPorId,
    listarEmAberto,
    encerrar,
    excluir,
    criarEntrega,
    removerEntrega,
    listarPorAtividade,
    editarEntregas
}