const router = require('express').Router()

const alunoController = require('../controllers/aluno-controller')
const excluirController = require('../controllers/excluir-controller')

router.get(
    '/',
    alunoController.listar
)

router.post(
    '/',
    alunoController.criar
)

router.get(
    '/:id',
    alunoController.buscarPorId
)

router.put(
    '/:id',
    alunoController.atualizar
)

router.put(
    '/:id/inativar',
    alunoController.inativar
)

router.put(
    '/:id/reativar', 
    alunoController.reativar 
)

router.delete('/:id', excluirController.excluir)

module.exports = router