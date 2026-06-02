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

module.exports = router