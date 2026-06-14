const router = require('express').Router()
const controller = require('../controllers/atividade-controller')

router.post('/', controller.criar)
router.get('/oficina/:oficinaId', controller.buscarPorOficina)
router.delete('/:id', controller.excluir)
router.put('/:atividadeId/entregas', controller.editarEntregas)
router.patch('/:id/encerrar', controller.encerrar)
router.get('/:atividadeId/entregas', controller.listarPorAtividade)
router.post('/:atividadeId/entregas', controller.criarEntrega)
router.delete('/:atividadeId/entregas/:alunoId', controller.removerEntrega)

module.exports = router