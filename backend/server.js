require('dotenv').config();

const app = require('../app');

const connectDatabase = require('./config/database');

connectDatabase();

app.listen(process.env.PORT, () => {

  console.log(
    `Servidor rodando na porta ${process.env.PORT}`
  );
});