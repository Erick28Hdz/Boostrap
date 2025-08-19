// rutas/dashboard.js
const express = require('express');
const router = express.Router();
const verificarSesion = require('../middlewares/verificarSesion');

router.get('/dashboard', verificarSesion, (req, res) => {
  res.render('dashboard', {
    usuario: req.usuario // ✅ PASA TODO EL OBJETO
  });
});

module.exports = router;
