require('dotenv').config()
const app = require('./app')

const { connectDatabase } =
require('./src/config/database');

async function start() {

  await connectDatabase();

  app.listen(process.env.PORT, () => {

    console.log(
      `Servidor rodando na porta ${process.env.PORT}`
    );

  });

}

start()