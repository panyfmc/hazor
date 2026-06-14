const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const alunoRoutes = require('./src/routes/aluno-router')
const igrejaRoutes = require('./src/routes/igreja-router')
const regiaoRoutes = require('./src/routes/regiao-router')
const grupoRouter = require('./src/routes/grupo-router')
const temporadaRouter = require('./src/routes/temporada-router')
const aulaRouter = require('./src/routes/aula-router')
const atividadeRouter = require('./src/routes/atividade-router')

app.use('/alunos', alunoRoutes)
app.use('/igrejas', igrejaRoutes)
app.use('/regioes', regiaoRoutes)
app.use('/grupos', grupoRouter)
app.use('/temporadas', temporadaRouter)
app.use('/aulas', aulaRouter)
app.use('/atividades', atividadeRouter)


module.exports = app