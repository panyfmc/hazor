const router = require('express').Router();

const alunoController =
require('../controllers/aluno-controller');

router.get(
    '/',
    alunoController.listar
);

module.exports = router;