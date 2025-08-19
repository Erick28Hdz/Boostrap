const express = require('express');
const router = express.Router();
const verificarSesion = require('../../middlewares/verificarSesion');
const verificarAdmin = require('../../middlewares/verificarAdmin');
const usuarioController = require('../../controllers/usuarioController'); // ✅ Importar el objeto completo

// Middleware para proteger las rutas
router.use(verificarSesion, verificarAdmin);

// Mostrar la vista con usuarios
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const usuarios = await usuarioController.obtenerUsuarios(filtro);

    // 🔍 Agrega este log para depurar
    console.log('Usuarios que llegan al render:', usuarios);

    res.render('admin/usuarios', {
      usuarios,     // <== ESTA VARIABLE DEBE EXISTIR
      filtro
    });
  } catch (error) {
    console.error('Error al mostrar la vista de usuarios:', error);

    // 🔥 ASEGÚRATE DE INCLUIR ESTO TAMBIÉN EN EL CATCH:
    res.render('admin/usuarios', {
      usuarios: [],   // 👈 ¡NO LO OLVIDES!
      filtro: '',
      error: 'No se pudo mostrar la lista de usuarios.'
    });
  }
});

// Crear un usuario (formulario y envío)
router.get('/crear', usuarioController.mostrarFormularioCrear);
router.post('/crear', usuarioController.crearUsuario);

// Editar usuario
router.get('/editar/:id', usuarioController.mostrarFormularioEditar);
router.post('/editar/:id', usuarioController.editarUsuario);

// Eliminar usuario
router.post('/eliminar/:id', usuarioController.eliminarUsuario);

module.exports = router;
