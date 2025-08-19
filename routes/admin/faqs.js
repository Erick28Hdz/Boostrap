const express = require('express');
const router = express.Router();
const verificarSesion = require('../../middlewares/verificarSesion');
const verificarAdmin = require('../../middlewares/verificarAdmin');
const faqController = require('../../controllers/faqController');

// Middleware de protección
router.use(verificarSesion, verificarAdmin);

// Mostrar todos los FAQs
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const faqs = await faqController.obtenerFAQs(filtro);

    res.render('admin/faqs', {
      faqs,
      filtro
    });
  } catch (error) {
    console.error('Error al mostrar los FAQs:', error);
    res.render('admin/faqs', {
      faqs: [],
      filtro: '',
      error: 'No se pudo mostrar la lista de FAQs.'
    });
  }
});

// Crear FAQ
router.get('/crear', faqController.mostrarFormularioCrearFAQ);
router.post('/crear', faqController.crearFAQ);

// Editar FAQ
router.get('/editar/:id', faqController.mostrarFormularioEditarFAQ);
router.post('/editar/:id', faqController.editarFAQ);

// Eliminar FAQ
router.post('/eliminar/:id', faqController.eliminarFAQ);

module.exports = router;
