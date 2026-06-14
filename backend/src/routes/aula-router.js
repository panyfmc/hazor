const router = require('express').Router()

const aulaController = require('../controllers/aula-controller') 

router.get('/', aulaController.listar)

router.post('/', aulaController.criar)

router.get('/:id', aulaController.buscarPorId)

router.put('/:id', aulaController.atualizar)

router.delete('/:id', aulaController.excluir)

module.exports = router