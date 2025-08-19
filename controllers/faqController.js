const FAQ = require('../models/FAQ');

// Obtener todas las FAQs con filtro opcional
const obtenerFAQs = async (filtro = '') => {
  try {
    let query = {};
    if (filtro) {
      query = {
        pregunta: new RegExp(filtro, 'i')
      };
    }

    const faqs = await FAQ.find(query);
    return faqs;
  } catch (error) {
    console.error('Error al obtener FAQs:', error);
    return [];
  }
};

// Mostrar formulario para crear FAQ
const mostrarFormularioCrearFAQ = (req, res) => {
  res.render('admin/crearFAQ', {
    usuario: req.usuario
  });
};

// Crear una nueva FAQ
const crearFAQ = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;

    const nuevaFAQ = new FAQ({ pregunta, respuesta });
    await nuevaFAQ.save();

    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('Error al crear FAQ:', err);
    res.status(500).render('admin/crearFAQ', {
      error: 'Error interno al crear la FAQ',
      datos: req.body,
      usuario: req.usuario
    });
  }
};

// Mostrar formulario para editar una FAQ existente
const mostrarFormularioEditarFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.redirect('/admin/faqs');
    }

    res.render('admin/editarFAQ', {
      faq,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al obtener FAQ:', err);
    res.status(500).send('Error al cargar el formulario de edición');
  }
};

// Editar FAQ existente
const editarFAQ = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;

    await FAQ.findByIdAndUpdate(req.params.id, { pregunta, respuesta });
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('Error al editar FAQ:', err);
    res.status(500).send('Error interno al editar la FAQ');
  }
};

// Eliminar FAQ
const eliminarFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('Error al eliminar FAQ:', err);
    res.status(500).send('Error interno al eliminar la FAQ');
  }
};

// Mostrar vista principal de FAQs
const mostrarFAQs = async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const faqs = await obtenerFAQs(filtro);

    res.render('admin/faqs', {
      faqs,
      filtro,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al mostrar FAQs:', err);
    res.render('admin/faqs', {
      faqs: [],
      filtro: '',
      usuario: req.usuario,
      error: 'Error al cargar las FAQs'
    });
  }
};

module.exports = {
  obtenerFAQs,
  mostrarFormularioCrearFAQ,
  crearFAQ,
  mostrarFormularioEditarFAQ,
  editarFAQ,
  eliminarFAQ,
  mostrarFAQs
};
