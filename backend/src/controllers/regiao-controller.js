const regiaoRepository = require('../repositories/regiao-repository')

async function listar(req, res) {
    const regioes = await regiaoRepository.listar()
    res.json(regioes)
}

module.exports = {
    listar
}