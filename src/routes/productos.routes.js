const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// get /api/productos - listar todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// get /api/productos/:id - obtener uno
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// post /api/productos - crear
router.post('/', async (req, res) => {
  const { nombre, categoria, precio, stock, imagen_url, descripcion } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: 'nombre y precio son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, categoria, precio, stock, imagen_url, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, categoria, precio, stock || 0, imagen_url, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// put /api/productos/:id - actualizar
router.put('/:id', async (req, res) => {
  const { nombre, categoria, precio, stock, imagen_url, descripcion } = req.body;

  try {
    const result = await pool.query(
      `UPDATE productos
       SET nombre = $1, categoria = $2, precio = $3, stock = $4, imagen_url = $5, descripcion = $6
       WHERE id = $7 RETURNING *`,
      [nombre, categoria, precio, stock, imagen_url, descripcion, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// delete /api/productos/:id - eliminar
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;