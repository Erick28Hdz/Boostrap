const Publicidad = require('../models/Publicidad');
const FAQ = require('../models/FAQ');
const path = require('path');
const fs = require('fs');

// 📌 Mostrar carrusel en la vista pública (inicio)
const renderCarrusel = async (req, res) => {
  try {
    const imagenes = await Publicidad.find().lean();
    const faqs = await FAQ.find().lean(); // 👈 FAQs desde la BD

    res.render('index', {
      imagenes,
      faqs // 👈 Pasamos las FAQs a la vista
    });
  } catch (error) {
    console.error('Error al renderizar index:', error);
    res.status(500).send('Error interno');
  }
};

// 📌 Mostrar todas las publicidades en el panel admin
const mostrarPublicidades = async (req, res) => {
  try {
    const publicidades = await Publicidad.find().lean();
    res.render('admin/publicidad', { publicidades });
  } catch (error) {
    console.error('Error al mostrar publicidades:', error);
    res.status(500).send('Error al cargar las publicidades');
  }
};

// 📌 Mostrar formulario para nueva publicidad
const mostrarFormularioCrearPublicidad = (req, res) => {
  res.render('admin/publicidad');
};

// 📌 Crear nueva publicidad
const crearPublicidad = async (req, res) => {
  try {
    const total = await Publicidad.countDocuments();
    if (total >= 5) {
      return res.status(400).send('Solo puedes tener 5 imágenes en el carrusel.');
    }

    if (!req.file) {
      return res.status(400).send('Debes subir una imagen.');
    }

    const nuevaPublicidad = new Publicidad({
      imagen: `publicidad/${req.file.filename}`, // Ruta relativa desde /uploads
      titulo: req.body.titulo,
      descripcion: req.body.descripcion
    });

    await nuevaPublicidad.save();
    res.redirect('/admin/publicidad');
  } catch (error) {
    console.error('Error al guardar publicidad:', error);
    res.status(500).send('Error al guardar la publicidad');
  }
};

// 📌 Eliminar publicidad (incluyendo imagen del sistema)
const eliminarPublicidad = async (id) => {
  const publicidad = await Publicidad.findById(id);
  if (!publicidad) {
    throw new Error('Publicidad no encontrada');
  }

  const rutaImagen = path.join(__dirname, '../public/uploads', publicidad.imagen);
  if (fs.existsSync(rutaImagen)) {
    await fs.promises.unlink(rutaImagen);
    console.log(`Imagen eliminada: ${rutaImagen}`);
  } else {
    console.warn(`La imagen no existe: ${rutaImagen}`);
  }

  await Publicidad.findByIdAndDelete(id);
};

module.exports = {
  renderCarrusel,
  mostrarPublicidades,
  mostrarFormularioCrearPublicidad,
  crearPublicidad,
  eliminarPublicidad
};
