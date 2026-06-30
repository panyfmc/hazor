const router = require('express').Router()
const controller = require('../controllers/temporada-controller')

router.get('/', controller.listar)
router.get('/ativa', controller.buscarAtiva)
router.post('/', controller.criar)

module.exports = router