const Promotion = require('../models/promotions');
const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path');

// Obtener promociones con filtro opcional
const obtenerPromociones = async (filtro = '') => {
  try {
    let query = {};
    if (filtro) {
      query = {
        $or: [
          { titulo: new RegExp(filtro, 'i') },
          { descripcion: new RegExp(filtro, 'i') }
        ]
      };
    }

    const promociones = await Promotion.find(query)
      .populate({
        path: 'productos',
        select: 'nombre precio' // <-- aquí aseguramos que venga el precio
      })
      .populate({
        path: 'categorias',
        select: 'nombre'
      });
    return promociones;
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    return [];
  }
};

// Mostrar formulario para crear promoción
const mostrarFormularioCrearPromocion = async (req, res) => {
  const productos = await Product.find();
  const categorias = await Category.find();
  res.render('admin/crearPromocion', { productos, categorias });
};

// Crear promoción
const crearPromocion = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      valor,
      productos,
      categorias,
      fecha_inicio,
      fecha_fin
    } = req.body;

    const nuevaPromocion = new Promotion({
      titulo,
      descripcion,
      tipo,
      valor,
      productos: Array.isArray(productos)
        ? productos.filter(p => p)
        : productos ? [productos] : [],

      categorias: Array.isArray(categorias)
        ? categorias.filter(c => c)
        : categorias ? [categorias] : [],
      fecha_inicio,
      fecha_fin,
      activa: true
    });

    await nuevaPromocion.save();
    res.redirect('/admin/promociones');
  } catch (err) {
    console.error('Error al crear promoción:', err);
    res.status(500).send('Error interno al crear la promoción');
  }
};

// Mostrar formulario para editar promoción
const mostrarFormularioEditarPromocion = async (req, res) => {
  try {
    const promocion = await Promotion.findById(req.params.id);
    const productos = await Product.find();
    const categorias = await Category.find();
    res.render('admin/editarPromocion', { promocion, productos, categorias });
  } catch (err) {
    console.error('Error al obtener promoción:', err);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Editar promoción
const editarPromocion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      tipo,
      valor,
      productos,
      categorias,
      fecha_inicio,
      fecha_fin,
      activa
    } = req.body;

    const promocion = await Promotion.findById(id);
    if (!promocion) return res.status(404).send('Promoción no encontrada');

    promocion.titulo = titulo;
    promocion.descripcion = descripcion;
    promocion.tipo = tipo;
    promocion.valor = valor;
    promocion.productos = Array.isArray(productos)
      ? productos.filter(p => p)
      : productos ? [productos] : [];

    promocion.categorias = Array.isArray(categorias)
      ? categorias.filter(c => c)
      : categorias ? [categorias] : [];
    promocion.fecha_inicio = fecha_inicio;
    promocion.fecha_fin = fecha_fin;
    promocion.activa = activa === 'on'; // Checkbox

    await promocion.save();
    res.redirect('/admin/promociones');
  } catch (err) {
    console.error('Error al editar promoción:', err);
    res.status(500).send('Error al editar promoción');
  }
};

// Eliminar promoción
const eliminarPromocion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.redirect('/admin/promociones');
  } catch (err) {
    console.error('Error al eliminar promoción:', err);
    res.status(500).send('Error interno al eliminar la promoción');
  }
};

// Mostrar vista de promociones
const mostrarPromociones = async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const promociones = await obtenerPromociones(filtro);
    const productos = await Product.find();
    const categorias = await Category.find();

    res.render('admin/promociones', {
      promociones,
      filtro,
      productos,
      categorias,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al mostrar promociones:', err);
    res.render('admin/promociones', {
      promociones: [],
      filtro: '',
      productos: [],
      categorias: [],
      usuario: req.usuario,
      error: 'Error al cargar promociones'
    });
  }
};

module.exports = {
  obtenerPromociones,
  mostrarFormularioCrearPromocion,
  crearPromocion,
  mostrarFormularioEditarPromocion,
  editarPromocion,
  eliminarPromocion,
  mostrarPromociones
};
