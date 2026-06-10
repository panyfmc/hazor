const igrejaRepository = require('../repositories/igreja-repository')

async function listar(req, res) {
    const igrejas = await igrejaRepository.listar()
    res.json(igrejas)
}

async function listarPorRegiao(req, res) {
    const regiaoId = req.params.regiaoId
    const igrejas = await igrejaRepository.listarPorRegiao(regiaoId)
    res.json(igrejas)
}

module.exports = {
    listar,
    listarPorRegiao
}

