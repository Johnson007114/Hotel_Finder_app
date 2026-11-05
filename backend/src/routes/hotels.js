const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const upload = require('../middleware/upload');
const validateHotel = require('../middleware/validate');

const router = express.Router();

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '..', '..', imagePath);
  fs.unlink(fullPath, () => {});
};

router.get('/', async (req, res, next) => {
  try {
    const { title, minPrice, maxPrice } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 6, 50);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const conditions = [];
    const params = [];

    if (title) {
      params.push(`%${title}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }
    if (minPrice !== undefined && minPrice !== '') {
      params.push(Number(minPrice));
      conditions.push(`price >= $${params.length}`);
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      params.push(Number(maxPrice));
      conditions.push(`price <= $${params.length}`);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM hotels ${where}`, params);

    const dataResult = await pool.query(
      `SELECT * FROM hotels ${where} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({ data: dataResult.rows, total: parseInt(countResult.rows[0].count), limit, offset });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Hotel not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', upload.single('image'), validateHotel({ imageRequired: true }), async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = '/uploads/' + req.file.filename;

    const result = await pool.query(
      `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title.trim(), description.trim(), imagePath, latitude, longitude, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
});

router.put('/:id', upload.single('image'), validateHotel({ imageRequired: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : existing.rows[0].image_path;

    const result = await pool.query(
      `UPDATE hotels
         SET title = $1, description = $2, image_path = $3, latitude = $4, longitude = $5, price = $6
       WHERE id = $7 RETURNING *`,
      [title.trim(), description.trim(), imagePath, latitude, longitude, price, id]
    );

    if (req.file) deleteImageFile(existing.rows[0].image_path);
    res.json(result.rows[0]);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING image_path', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Hotel not found' });

    deleteImageFile(result.rows[0].image_path);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;