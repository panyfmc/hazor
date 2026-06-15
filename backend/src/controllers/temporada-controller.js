const service = require('../services/temporada-service')

async function listar(req, res) {
    const temporadas = await service.listar()
    res.json(temporadas)
}

async function criar(req, res) {
    const temporada = await service.criar(req.body)
    res.status(201).json(temporada)
}

async function buscarAtiva(req, res) {
    const temporada = await service.buscarAtiva(req.body)
    res.json(temporada)
}

module.exports = {
    listar,
    criar,
    buscarAtiva
}

