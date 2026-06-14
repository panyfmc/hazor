const aulaService = require('../services/aula-service')

async function listar(req, res) {
    try {
        const aulas = await aulaService.listar()
        res.json(aulas)
    } catch(error) {
        res.status(400).json({
            mensagem: error.message
        })
    }
    
}

async function criar(req, res) {
    try {
        const aula = await aulaService.criar(req.body)
        res.status(201).json(aula)
    } catch(error) {
        res.status(400).json({
            mensagem: error.message
        })
    }
}

async function buscarPorId(req, res) {
    try {
        const aula = await aulaService.buscarPorId(req.params.id)
        res.json(aula)
    } catch(error) {
        res.status(400).json({
            mensagem: error.message
        })
    }
}

async function atualizar(req, res) {
    try {
        const aula = await aulaService.atualizar(req.params.id, req.body)
        res.json(aula)
    } catch(error) {
        res.status(400).json({
            mensagem: error.message
        })
    }
}

async function excluir(req, res) {
    try {
        await aulaService.excluir(req.params.id)
        res.json({
            mensagem: 'Oficina excluída'
        })

    } catch (error) {
        res.status(400).json({
            mensagem: error.message
        })
    }
}

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    excluir
}