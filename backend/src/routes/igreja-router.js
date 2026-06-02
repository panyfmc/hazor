const router = require('express').Router()
const igrejaController = require('../controllers/igreja-controller')

router.get(
    '/',
    igrejaController.listar
)

router.get(
    '/regiao/:regiaoId',
    igrejaController.listarPorRegiao
)

module.exports = router