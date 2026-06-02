const alunoService = require('../services/aluno-service')

async function listar(req, res) {
    const alunos = await alunoService.listar()

    res.json(alunos)
}

async function criar(req, res) {

    await alunoService.criar(req.body)

    res.status(201).json({
        mensagem: 'Aluno criado'
    })
}

async function buscarPorId(req, res) {
    const aluno = await alunoService.buscarPorId(req.params.id)
    res.json(aluno)
}

module.exports = {
    listar,
    buscarPorId,
    criar
}