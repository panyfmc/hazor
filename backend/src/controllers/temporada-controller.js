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
    try {
        const temporada = await service.buscarAtiva() 
        if (!temporada) {
            return res.status(404).json({ message: "Nenhuma temporada ativa encontrada." })
        }
        res.json(temporada)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    listar,
    criar,
    buscarAtiva
}

