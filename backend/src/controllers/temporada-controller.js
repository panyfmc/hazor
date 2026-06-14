const service = require('../services/temporada-service')

exports.listar = async(req, res) => {
    const dados = await service.listar()
    res.json(dados)
}

exports.criar = async(req, res) => {
    await service.criar(req.body)
    res.sendStatus(201)
}