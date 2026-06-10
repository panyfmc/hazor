const excluirService = require("../services/excluir-service")

async function excluir(req, res) {

    try {

        await excluirService.excluir(req.params.id)

        res.json({
            mensagem: 'Aluno excluído'
        })

    } catch (error) {

        res.status(400).json({
            mensagem: error.message
        })

    }
}

module.exports = {
    excluir
}