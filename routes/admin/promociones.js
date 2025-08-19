const express = require('express');
const router = express.Router();
const verificarSesion = require('../../middlewares/verificarSesion');
const verificarAdmin = require('../../middlewares/verificarAdmin');
const promocionController = require('../../controllers/promocionController');

// Middleware de protección
router.use(verificarSesion, verificarAdmin);

// Mostrar todas las promociones
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const promociones = await promocionController.obtenerPromociones(filtro);

    res.render('admin/promociones', {
      promociones,
      filtro
    });
  } catch (error) {
    console.error('Error al mostrar las promociones:', error);
    res.render('admin/promociones', {
      promociones: [],
      filtro: '',
      error: 'No se pudo mostrar la lista de promociones.'
    });
  }
});

// Crear promoción
router.get('/crear', promocionController.mostrarFormularioCrearPromocion);
router.post('/crear', promocionController.crearPromocion);

// Editar promoción
router.get('/editar/:id', promocionController.mostrarFormularioEditarPromocion);
router.post('/editar/:id', promocionController.editarPromocion);

// Eliminar promoción
router.post('/eliminar/:id', promocionController.eliminarPromocion);

module.exports = router;
