const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('rol');

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    if (!user.rol) {
      return res.status(401).json({ message: 'Rol no asignado al usuario' });
    }

    // 🟢 Guardar sesión (en servidor)
    req.session.usuario = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol.nombre
    };

    // 🟢 Retornar mensaje de éxito en JSON
    res.json({ success: true, message: 'Inicio de sesión exitoso' });

  } catch (err) {
    console.error('🔴 Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

