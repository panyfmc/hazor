const router = require('express').Router()
const controller = require('../controllers/temporada-controller')

router.get('/', controller.listar)
router.post('/', controller.criar)
router.get('/ativa', controller.buscarAtiva)

module.exports = router