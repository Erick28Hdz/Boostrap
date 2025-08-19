const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/uploadPublicidad'); // Middleware Multer
const verificarSesion = require('../../middlewares/verificarSesion');
const publicidadController = require('../../controllers/publicidadController');

// Middleware de protección
router.use(verificarSesion);

// Mostrar todas las publicidades y formulario
router.get('/', async (req, res) => {
  try {
    const publicidades = await publicidadController.obtenerPublicidades();

    res.render('admin/publicidad', {
      publicidades
    });
  } catch (error) {
    console.error('Error al mostrar las publicidades:', error);
    res.render('admin/publicidad', {
      publicidades: [],
      error: 'No se pudo cargar la lista de publicidades.'
    });
  }
});

// Crear nueva publicidad (con imagen)
router.post('/nueva', upload.single('imagen'), async (req, res) => {
  try {
    await publicidadController.crearPublicidad(req, res);
  } catch (error) {
    console.error('Error al crear publicidad:', error);
    res.redirect('/admin/publicidad'); // O puedes mostrar un mensaje específico
  }
});

// Eliminar publicidad
router.post('/eliminar/:id', async (req, res) => {
  try {
    await publicidadController.eliminarPublicidad(req.params.id);
    res.redirect('/admin/publicidad');
  } catch (error) {
    console.error('Error al eliminar publicidad:', error);
    res.redirect('/admin/publicidad');
  }
});

module.exports = router;
