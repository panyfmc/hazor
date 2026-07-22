const service = require('../services/temporada-service')

async function listar(req, res) {
    try {
        const temporadas = await service.listar()
        res.json(temporadas)
    } catch (error) {
        console.error("Erro ao listar temporadas:", error)
        res.status(500).json({ error: "Erro ao listar temporadas" })
    }
}

async function criar(req, res) {
    try {
        const temporada = await service.criar(req.body)
        res.status(201).json(temporada)
    } catch (error) {
        console.error("Erro ao criar temporada:", error)
        res.status(500).json({ error: error.message || "Erro ao criar temporada" })
    }
}

async function buscarPorId(req, res) {
    try {
        const temporada = await service.buscarPorId(req.params.id)
        
        if (!temporada) {
            return res.status(404).json({ 
                message: "Nenhuma temporada encontrada." 
            })
        }
        
        res.json(temporada)
    } catch (error) {
        console.error("Erro ao buscar temporada:", error)
        res.status(500).json({ error: "Erro interno ao buscar temporada" })
    }
}

async function atualizar(req, res) {
    try {
        await service.atualizar
        (
            Number(req.params.id),
            req.body
        )
        res.sendStatus(204)

    } catch (error) {

        console.error(error)
        return res.status(500).json({error: error.message})
    }
}

async function excluir(req, res) {
    try {
        const { id } = req.params
        const resultado = await service.excluir(id)
        
        res.status(200).json({message: "Temporada excluída com sucesso"})
    } catch (error) {
        console.error("Erro no Controller ao excluir temporada:", error)
        
        // Tratamento específico para erro de negócio
        if (error.message.includes("Não é possível excluir")) {
            return res.status(400).json({ error: error.message })
        }
        
        res.status(500).json({ 
            error: "Erro interno ao tentar excluir a temporada." 
        })
    }
}

module.exports = {
    listar,
    criar,
    buscarPorId,  
    atualizar,    
    excluir
}