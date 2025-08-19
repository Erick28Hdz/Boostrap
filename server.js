const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');

// Modelos que necesitas en rutas públicas
const Producto = require('./models/Product');
const Categoria = require('./models/Category');
const Promocion = require('./models/promotions');

// Rutas
const authRoutes = require('./routes/auth');
const registerRoute = require('./routes/register');
const adminRoutes = require('./routes/admin');
const usuariosAdminRoutes = require('./routes/admin/usuarios');
const categoriasAdminRoutes = require('./routes/admin/categorias');
const productosAdminRoutes = require('./routes/admin/productos');
const publicidadAdminRoutes = require('./routes/admin/Publicidad');
const promocionesAdminRoutes = require('./routes/admin/promociones');
const faqsAdminRoutes = require('./routes/admin/faqs');
const indexRoutes = require('./routes/index');

// Middleware
const verificarSesion = require('./middlewares/verificarSesion');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
require('./config/db')();

const app = express();

// Configurar sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'miSecreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Middleware globales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Helmet para seguridad
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
      ],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  })
);

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});


// 🧩 RUTAS API
app.use('/api', authRoutes);
app.use('/api', registerRoute);

// 🛠️ RUTAS ADMIN
app.use('/admin', adminRoutes);
app.use('/admin/usuarios', usuariosAdminRoutes);
app.use('/admin/categorias', categoriasAdminRoutes);
app.use('/admin/productos', productosAdminRoutes);
app.use('/admin/publicidad', publicidadAdminRoutes);
app.use('/admin/promociones', promocionesAdminRoutes);
app.use('/admin/faqs', faqsAdminRoutes);
app.use('/', indexRoutes);

// 🧭 RUTAS PÚBLICAS
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/nosotros', (req, res) => res.render('nosotros'));
app.get('/contacto', (req, res) => res.render('contacto'));

app.post('/enviar-mensaje', (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  console.log(`📩 Mensaje de ${nombre} (${correo}): ${mensaje}`);
  res.send("Gracias por tu mensaje. ¡Te contactaremos pronto!");
});

// Página de productos
app.get('/productos', async (req, res) => {
  try {
    const hoy = new Date();

    // 1️⃣ Obtener todos los productos con su categoría
    const productos = await Producto.find()
      .populate('categoria')
      .lean();

    // 2️⃣ Obtener todas las categorías
    const categorias = await Categoria.find().lean();

    // 3️⃣ Obtener todas las promociones activas con populate de categorías
    const promociones = await Promocion.find({
      fecha_inicio: { $lte: hoy },
      fecha_fin: { $gte: hoy }
    })
      .populate('categorias')
      .lean();

    // 4️⃣ Crear mapas de promociones por producto y por categoría
    const promosPorProducto = new Map();
    const promosPorCategoria = new Map();

    promociones.forEach(promo => {
      // Por producto
      (promo.productos || []).forEach(id => {
        promosPorProducto.set(String(id), promo);
      });
      // Por categoría
      (promo.categorias || []).forEach(cat => {
        const catId = String(cat._id);
        if (!promosPorCategoria.has(catId)) {
          promosPorCategoria.set(catId, []);
        }
        promosPorCategoria.get(catId).push({
          titulo: promo.titulo,
          tipo: promo.tipo,   // <-- Aquí agregamos el tipo de promoción
          valor: promo.valor
        });
      });
    });

    // 5️⃣ Asignar promo activa a cada producto
    productos.forEach(p => {
      const promo =
        promosPorProducto.get(String(p._id)) ||
        promosPorCategoria.get(String(p.categoria?._id))?.[0]; // tomar la primera promoción activa

      p.promocionActiva = promo || null;
    });

    // 6️⃣ Asignar promociones a cada categoría (con tipo)
    categorias.forEach(cat => {
      cat.promociones = promosPorCategoria.get(String(cat._id)) || [];
    });

    // 7️⃣ Filtrar promociones activas que tengan al menos una categoría
    const promocionesActivasCategorias = promociones.filter(
      promo => promo.categorias && promo.categorias.length > 0
    );

    // 8️⃣ Renderizar vista
    res.render('productos', { 
      productos, 
      categorias, 
      promociones: promocionesActivasCategorias 
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.render('productos', { productos: [], categorias: [], promociones: [] });
  }
});

// Dashboard protegido
app.get('/dashboard', verificarSesion, (req, res) => {
  res.render('dashboard', { usuario: req.session.usuario });
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Error al cerrar sesión:', err);
    res.redirect('/');
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
