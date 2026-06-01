const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),

  options: {
    trustServerCertificate: true
  }
};

async function connectDatabase() {
  try {

    await sql.connect(config);

    console.log('Banco conectado');

  } catch (error) {

    console.error(error);

  }
}

module.exports = {
  sql,
  connectDatabase
};