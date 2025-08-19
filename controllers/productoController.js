const Product = require('../models/Product');
const Category = require('../models/Category');
const Promocion = require('../models/promotions');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

// Obtener productos con promociones activas
const obtenerProductos = async (filtro = '') => {
  try {
    let query = {};
    if (filtro) {
      query = {
        $or: [
          { nombre: new RegExp(filtro, 'i') },
          { descripcion: new RegExp(filtro, 'i') }
        ]
      };
    }

    // 1️⃣ Obtener todos los productos con su categoría
    const productos = await Product.find(query)
      .populate('categoria')
      .lean();

    const hoy = new Date();

    // 2️⃣ Obtener TODAS las promociones activas
    const promociones = await Promocion.find({
      fecha_inicio: { $lte: hoy },
      fecha_fin: { $gte: hoy }
    }).lean();

    // 3️⃣ Crear mapas para relacionar promos
    const promosPorProducto = new Map();
    const promosPorCategoria = new Map();

    for (let promo of promociones) {
      // promos por producto
      for (let prodId of promo.productos || []) {
        promosPorProducto.set(String(prodId), promo);
      }
      // promos por categoría
      for (let catId of promo.categorias || []) {
        promosPorCategoria.set(String(catId), promo);
      }
    }

    // 4️⃣ Asignar promoción activa a cada producto
    for (let p of productos) {
      const promo =
        promosPorProducto.get(String(p._id)) ||
        promosPorCategoria.get(String(p.categoria?._id));

      p.promocionActiva = promo
        ? {
          titulo: promo.titulo,
          tipo: promo.tipo,
          valor: promo.valor
        }
        : null;
    }

    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

// Mostrar formulario de creación
const mostrarFormularioCrearProducto = async (req, res) => {
  const categorias = await Category.find();
  res.render('admin/crearProducto', { categorias });
};

// Crear producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    // Si hay imagen, guarda con la subcarpeta "productos/"
    const foto = req.file ? `productos/${req.file.filename}` : '';

    const nuevoProducto = new Product({
      nombre,
      descripcion,
      precio,
      foto, // Esto ahora tiene la subcarpeta incluida
      categoria
    });

    await nuevoProducto.save();
    res.redirect('/admin/productos');
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).send('Error interno al crear el producto');
  }
};

// Mostrar formulario de edición
const mostrarFormularioEditarProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    const categorias = await Category.find();
    res.render('admin/editarProducto', { producto, categorias });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Editar producto
const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria } = req.body;

    const producto = await Product.findById(id);
    if (!producto) return res.status(404).send('Producto no encontrado');

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.categoria = categoria;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const nombreArchivo = `${id}${ext}`;
      producto.foto = `productos/${nombreArchivo}`;
    }

    await producto.save();
    res.redirect('/admin/productos');
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).send('Error al editar producto');
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/productos');
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).send('Error interno al eliminar el producto');
  }
};

// Mostrar vista de productos
const mostrarProductos = async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const productos = await obtenerProductos(filtro);
    const categorias = await Category.find();

    res.render('admin/productos', {
      productos,
      filtro,
      categorias,
      usuario: req.usuario
    });
  } catch (err) {
    console.error('Error al mostrar productos:', err);
    res.render('admin/productos', {
      productos: [],
      filtro: '',
      categorias: [],
      usuario: req.usuario,
      error: 'Error al cargar productos'
    });
  }
};

// 📥 Importar productos desde archivo Excel
const importarProductosDesdeExcel = async (req, res) => {
  try {
    const archivo = req.file;
    if (!archivo) {
      return res.status(400).send('No se proporcionó ningún archivo');
    }

    const workbook = xlsx.readFile(archivo.path);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(hoja);

    const productosNuevos = [];

    for (const item of datos) {
      if (item.nombre && item.precio && item.categoria) {
        // Buscar la categoría por nombre (relación)
        const categoria = await Category.findOne({ nombre: item.categoria });

        if (categoria) {
          productosNuevos.push({
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            precio: item.precio,
            categoria: categoria._id,
            foto: item.foto || 'default.jpg'
          });
        }
      }
    }

    if (productosNuevos.length > 0) {
      await Product.insertMany(productosNuevos);
    }

    fs.unlinkSync(archivo.path); // elimina archivo después de importar
    res.redirect('/admin/productos');
  } catch (err) {
    console.error('Error al importar productos:', err);
    res.status(500).send('Error al importar los productos');
  }
};

module.exports = {
  obtenerProductos,
  mostrarFormularioCrearProducto,
  crearProducto,
  mostrarFormularioEditarProducto,
  editarProducto,
  eliminarProducto,
  mostrarProductos,
  importarProductosDesdeExcel
};
