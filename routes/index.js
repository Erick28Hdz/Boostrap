// routes/index.js
const express = require('express');
const router = express.Router();
const publicidadController = require('../controllers/publicidadController');

router.get('/', publicidadController.renderCarrusel);

module.exports = router;