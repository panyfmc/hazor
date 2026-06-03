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

async function atualizar(req, res) {
    await alunoService.atualizar(req.params.id, req.body)
    res.json({
        mensagem: 'Aluno atualizado'
    })
}

async function inativar(req, res) {
    await alunoService.inativar(req.params.id)
    res.json({
        mensagem: 'Aluno inativado'
    })
}


async function reativar(req, res) {
    await alunoService.reativar(req.params.id)
    res.json({
        mensagem: 'Aluno reativado'
    })
}


module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    inativar,
    reativar
}