const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb } = require('./db');
const productosRoutes = require('./routes/productos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Cafetería funcionando ☕' });
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar la app:', err);
    process.exit(1);
  }
}

start();