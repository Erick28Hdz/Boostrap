const User = require('../models/User');

const verificarSesion = async (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }

  try {
    const usuario = await User.findById(req.session.usuario.id).populate('rol');
    if (!usuario) {
      return res.redirect('/login');
    }

    // ✅ Actualiza tanto la sesión como el req.usuario con los datos completos
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: {
        nombre: usuario.rol.nombre // << asegúrate que esto exista
      }
    };

    req.usuario = req.session.usuario;

    next();
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return res.status(500).json({ mensaje: 'Error al verificar la sesión' });
  }
};

module.exports = verificarSesion;
