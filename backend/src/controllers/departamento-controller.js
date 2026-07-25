const service = require('../services/departamento-service')

async function listar(req, res) {
    const departamentos = await service.listar()
    res.json(departamentos)
}

module.exports = {
    listar
}