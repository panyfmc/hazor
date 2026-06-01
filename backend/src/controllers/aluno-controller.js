const alunoRepository =
require('../repositories/aluno-repository');

async function listar(req, res) {

    const alunos =
        await alunoRepository.listar();

    res.json(alunos);
}

module.exports = {
    listar
};