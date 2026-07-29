const router = require('express').Router()
const controller = require('../controllers/departamento-controller')
const { listar } = require('../repositories/oficina-repository')

router.get('/', controller.listar)

module.exports = router