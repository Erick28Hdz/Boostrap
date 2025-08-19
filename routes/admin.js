const express = require('express');
const router = express.Router();
const verificarSesion = require('../middlewares/verificarSesion');
const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol.nombre !== 'admin') {
    return res.status(403).send('Acceso denegado. No eres administrador.');
  }
  next();
};

// Middlewares adicionales
const uploadExcel = require('../middlewares/uploadExcel'); // 👈 nuevo

// Controladores
const usuarioController = require('../controllers/usuarioController');
const productoController = require('../controllers/productoController');
const categoriaController = require('../controllers/categoriaController');
const publicidadController = require('../controllers/publicidadController');
const promocionController = require('../controllers/promocionController');
const faqController = require('../controllers/faqController');

// 📦 Productos
router.get('/productos', verificarSesion, verificarAdmin, productoController.mostrarProductos);

// 📂 Categorías
router.get('/categorias', verificarSesion, verificarAdmin, categoriaController.mostrarCategorias);
router.post('/categorias/importar', verificarSesion, verificarAdmin, uploadExcel.single('archivo'), categoriaController.importarCategoriasDesdeExcel); // 👈 nueva ruta

// 🎁 Promociones
router.get('/promociones', verificarSesion, verificarAdmin, promocionController.mostrarPromociones);

// ❓ FAQs
router.get('/faqs', verificarSesion, verificarAdmin, faqController.mostrarFAQs);

// 👥 Usuarios
router.get('/usuarios', verificarSesion, verificarAdmin, usuarioController.mostrarUsuarios);

// 📢 Publicidad
router.get('/publicidad', verificarSesion, verificarAdmin, publicidadController.mostrarPublicidades);

module.exports = router;
