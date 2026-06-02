const grupoRepository = require('../repositories/grupo-repository')

async function listar(req, res) {
    const grupos = await grupoRepository.listar()
    res.json(grupos)
}

module.exports = {
    listar
}