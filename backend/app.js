const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const alunoRoutes = require('./src/routes/aluno-router')
const igrejaRoutes = require('./src/routes/igreja-router')
const regiaoRoutes = require('./src/routes/regiao-router')
const grupoRouter = require('./src/routes/grupo-router')

app.use('/api/alunos', alunoRoutes)
app.use('/api/igrejas', igrejaRoutes)
app.use('/api/regioes', regiaoRoutes)
app.use('/api/grupos', grupoRouter)

module.exports = app