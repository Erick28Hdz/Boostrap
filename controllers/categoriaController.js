const Category = require('../models/Category');
const Promocion = require('../models/promotions');
const xlsx = require('xlsx');
const fs = require('fs');

// Obtener categorías con promociones activas
const obtenerCategorias = async (filtro = '') => {
  try {
    let query = {};
    if (filtro) {
      query = {
        nombre: new RegExp(filtro, 'i')
      };
    }

    // 1️⃣ Obtener todas las categorías
    const categorias = await Category.find(query).lean();

    const hoy = new Date();

    // 2️⃣ Obtener TODAS las promociones activas con populate de categorías
    const promociones = await Promocion.find({
      fecha_inicio: { $lte: hoy },
      fecha_fin: { $gte: hoy }
    })
      .populate('categorias') // <-- Aquí traes los datos completos de las categorías
      .lean();

    // 3️⃣ Crear mapa promos por categoría
    const promosPorCategoria = new Map();
    for (let promo of promociones) {
      for (let cat of promo.categorias || []) {
        const catId = String(cat._id); // <-- Aquí tomamos el _id real
        if (!promosPorCategoria.has(catId)) {
          promosPorCategoria.set(catId, []);
        }
        promosPorCategoria.get(catId).push(promo);
      }
    }

    // 4️⃣ Asignar promos activas a cada categoría
    for (let cat of categorias) {
      cat.promociones = promosPorCategoria.get(String(cat._id)) || [];
    }

    return categorias;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

// Mostrar formulario para crear categoría
const mostrarFormularioCrearCategoria = (req, res) => {
  res.render('admin/crearCategoria', {
    usuario: req.usuario
  });
};

// Crear categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCategoria = new Category({ nombre });
    await nuevaCategoria.save();

    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).render('admin/crearCategoria', {
      error: 'Error interno al crear la categoría',
      datos: req.body,
      usuario: req.usuario
    });
  }
};

// Mostrar formulario para editar categoría
const mostrarFormularioEditarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) {
      return res.redirect('/admin/categorias');
    }

    res.render('admin/editarCategoria', {
      categoria,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al obtener categoría:', err);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Editar categoría
const editarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { nombre });

    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Error al editar categoría:', err);
    res.status(500).send('Error interno al editar la categoría');
  }
};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).send('Error interno al eliminar la categoría');
  }
};

// Mostrar vista de categorías
const mostrarCategorias = async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const categorias = await obtenerCategorias(filtro);

    res.render('admin/categorias', {
      categorias,
      filtro,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al mostrar categorías:', err);
    res.render('admin/categorias', {
      categorias: [],
      filtro: '',
      usuario: req.usuario,
      error: 'Error al cargar las categorías'
    });
  }
};

// 📥 Importar categorías desde archivo Excel
const importarCategoriasDesdeExcel = async (req, res) => {
  try {
    const archivo = req.file;
    if (!archivo) {
      return res.status(400).send('No se proporcionó ningún archivo');
    }

    const workbook = xlsx.readFile(archivo.path);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(hoja);

    const categoriasNuevas = [];

    for (const item of datos) {
      if (item.nombre) {
        const existe = await Category.findOne({ nombre: item.nombre });
        if (!existe) {
          categoriasNuevas.push({ nombre: item.nombre });
        }
      }
    }

    if (categoriasNuevas.length > 0) {
      await Category.insertMany(categoriasNuevas);
    }

    // Eliminar el archivo subido
    fs.unlinkSync(archivo.path);

    res.redirect('/admin/categorias');
  } catch (err) {
    console.error('Error al importar categorías:', err);
    res.status(500).send('Error al importar las categorías');
  }
};

module.exports = {
  obtenerCategorias,
  mostrarFormularioCrearCategoria,
  crearCategoria,
  mostrarFormularioEditarCategoria,
  editarCategoria,
  eliminarCategoria,
  mostrarCategorias,
  importarCategoriasDesdeExcel // <- NUEVO
};
