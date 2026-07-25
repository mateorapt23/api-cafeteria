const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Crea la tabla si no existe, apenas arranca la app
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      categoria VARCHAR(50),
      precio NUMERIC(10,2) NOT NULL,
      stock INTEGER DEFAULT 0,
      imagen_url TEXT,
      descripcion TEXT
    );
  `);
  console.log('✅ Tabla "productos" verificada/creada');
}

module.exports = { pool, initDb };
