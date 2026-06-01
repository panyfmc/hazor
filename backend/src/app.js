const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const alunoRoutes = require('./routes/aluno-router')

app.use('/api/alunos', alunoRoutes)

module.exports = app;