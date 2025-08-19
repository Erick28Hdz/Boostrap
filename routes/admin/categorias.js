const express = require('express');
const router = express.Router();
const verificarSesion = require('../../middlewares/verificarSesion');
const verificarAdmin = require('../../middlewares/verificarAdmin');
const categoryController = require('../../controllers/categoriaController');
const uploadExcel = require('../../middlewares/uploadExcel'); // 👈 nuevo

// Middleware de protección
router.use(verificarSesion, verificarAdmin);

// Mostrar todas las categorías
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const categorias = await categoryController.obtenerCategorias(filtro);

    res.render('admin/categorias', {
      categorias,
      filtro,
      usuario: req.usuario
    });
  } catch (error) {
    console.error('Error al mostrar las categorías:', error);
    res.render('admin/categorias', {
      categorias: [],
      filtro: '',
      error: 'No se pudo mostrar la lista de categorías.',
      usuario: req.usuario
    });
  }
});

// Crear categoría
router.get('/crear', categoryController.mostrarFormularioCrearCategoria);
router.post('/crear', categoryController.crearCategoria);

// Editar categoría
router.get('/editar/:id', categoryController.mostrarFormularioEditarCategoria);
router.post('/editar/:id', categoryController.editarCategoria);

// Eliminar categoría
router.post('/eliminar/:id', categoryController.eliminarCategoria);

// Importar categorías desde Excel
router.post('/importar', uploadExcel.single('archivo'), categoryController.importarCategoriasDesdeExcel); // 👈 nueva ruta

module.exports = router;
