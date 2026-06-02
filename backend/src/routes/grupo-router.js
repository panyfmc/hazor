const router = require('express').Router()
const grupoController = require('../controllers/grupo-controller')

router.get(
    '/',
    grupoController.listar
)

module.exports = router