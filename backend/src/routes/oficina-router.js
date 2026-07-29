const router = require('express').Router()

const oficinaController = require('../controllers/oficina-controller') 

router.get('/', oficinaController.listar)

router.post('/', oficinaController.criar)

router.get('/:id', oficinaController.buscarPorId)

router.put('/:id', oficinaController.atualizar)

router.delete('/:id', oficinaController.excluir)

module.exports = router