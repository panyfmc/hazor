const router = require('express').Router()

const alunoController =
require('../controllers/aluno-controller')

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

router.patch(
    '/:id/inativar',
    alunoController.inativar
)

router.patch(
    '/:id/reativar', 
    alunoController.reativar 
)

module.exports = router