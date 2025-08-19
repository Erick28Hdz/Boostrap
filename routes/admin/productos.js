const express = require('express');
const router = express.Router();
const Categoria = require('../../models/Category');
const verificarSesion = require('../../middlewares/verificarSesion');
const verificarAdmin = require('../../middlewares/verificarAdmin');
const upload = require('../../middlewares/uploadProducto');
const uploadExcel = require('../../middlewares/uploadExcel'); // 👈 nuevo
const productoController = require('../../controllers/productoController');

// Middleware de protección
router.use(verificarSesion, verificarAdmin);

// Mostrar todos los productos
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const productos = await productoController.obtenerProductos(filtro);
    const categorias = await Categoria.find(); // ✅ Aquí se obtienen las categorías

    res.render('admin/productos', {
      productos,
      filtro,
      categorias // ✅ Se envían a la vista
    });
  } catch (error) {
    console.error('Error al mostrar los productos:', error);
    res.render('admin/productos', {
      productos: [],
      filtro: '',
      categorias: [], // También enviar vacío si hay error
      error: 'No se pudo mostrar la lista de productos.'
    });
  }
});

// Crear producto
router.get('/crear', productoController.mostrarFormularioCrearProducto);
router.post('/crear', upload.single('foto'), productoController.crearProducto);

// Editar producto
router.get('/editar/:id', productoController.mostrarFormularioEditarProducto);
router.post('/editar/:id', upload.single('foto'), productoController.editarProducto);

// Eliminar producto
router.post('/eliminar/:id', productoController.eliminarProducto);

// Importar productos desde Excel
router.post('/importar', uploadExcel.single('archivo'), productoController.importarProductosDesdeExcel); // 👈 nueva ruta

module.exports = router;
