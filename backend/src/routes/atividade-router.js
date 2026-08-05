const router = require('express').Router()
const controller = require('../controllers/atividade-controller')

router.post('/', controller.criar)
router.post('/:atividadeId/entregas', controller.criarEntrega)
router.get('/oficina/:oficinaId', controller.buscarPorOficina)
router.get('/:atividadeId/entregas', controller.listarPorAtividade)
router.put('/:atividadeId/entregas', controller.editarEntregas)
router.patch('/:id/encerrar', controller.encerrar)
router.delete('/:id', controller.excluir)
router.delete('/:atividadeId/entregas/:alunoId', controller.removerEntrega)

module.exports = router