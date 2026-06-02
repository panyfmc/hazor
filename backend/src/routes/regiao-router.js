const router = require('express').Router()
const regiaoController = require('../controllers/regiao-controller')

router.get(
    '/', 
    regiaoController.listar
)

module.exports = router