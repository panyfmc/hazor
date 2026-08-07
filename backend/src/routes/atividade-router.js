const router = require('express').Router()
const controller = require('../controllers/atividade-controller')

router.post('/', controller.criar)
router.post('entrega/:atividadeId', controller.criarEntrega)
router.get('/oficina/:oficinaId', controller.buscarPorId)
router.get('/entregas/:atividadeId', controller.listarPorAtividade)
router.get('/:temporadaId', controller.listarEmAberto)
router.put('/entregas/:atividadeId', controller.editarEntregas)
router.patch('/encerrar/:id', controller.encerrar)
router.delete('/:id', controller.excluir)
router.delete('/:atividadeId/entregas/:alunoId', controller.removerEntrega)

module.exports = router