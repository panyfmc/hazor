const router = require('express').Router()
const controller = require('../controllers/temporada-controller')

router.get('/', controller.listar)
router.get('/ativa', controller.buscarAtiva)
router.post('/', controller.criar)
router.delete('/:id', controller.excluir)

module.exports = router