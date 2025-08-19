const User = require('../models/User');
const Role = require('../models/Role'); // si necesitas mostrar roles
const bcrypt = require('bcrypt');



// Mostrar lista de usuarios
const obtenerUsuarios = async (filtro = '') => {
  try {
    let query = {};
    if (filtro) {
      query = {
        $or: [
          { nombre: new RegExp(filtro, 'i') },
          { email: new RegExp(filtro, 'i') }
        ]
      };
    }

    const usuarios = await User.find(query).populate('rol');
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return []; // 🔁 DEVUELVE AL MENOS UN ARRAY VACÍO
  }
};

// Mostrar formulario para crear usuario
const mostrarFormularioCrear = async (req, res) => {
  const roles = await Role.find(); // para mostrar opciones de roles
  res.render('admin/crearUsuario', { roles });
};

// Crear usuario (guardar en DB)
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    await nuevoUsuario.save();
    res.redirect('/admin/usuarios');
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).send('Error interno al crear el usuario');
  }
};

// Mostrar formulario para editar
const mostrarFormularioEditar = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    const roles = await Role.find();
    res.render('admin/editarUsuario', { usuario, roles });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Editar usuario
const editarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;
    await User.findByIdAndUpdate(req.params.id, { nombre, email, rol });
    res.redirect('/admin/usuarios');
  } catch (err) {
    console.error('Error al editar usuario:', err);
    res.status(500).send('Error interno');
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/usuarios');
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).send('Error interno');
  }
};

const mostrarUsuarios = async (req, res) => {
  try {
    const filtro = req.query.buscar || '';
    const usuarios = await obtenerUsuarios(filtro);
    const roles = await Role.find();
    
    res.render('admin/usuarios', {
      usuarios,
      filtro,
      roles, 
      usuario: req.usuario  // ✅ NECESARIO para el sidebar y la vista
    });
  } catch (err) {
    console.error('Error al mostrar usuarios:', err);
    res.render('admin/usuarios', {
      usuarios: [],
      filtro: '',
      roles: [],
      usuario: req.usuario, // ✅ aún si falla
      error: 'Error al cargar usuarios'
    });
  }
};

// Exportar todos los métodos
module.exports = {
  obtenerUsuarios,
  mostrarFormularioCrear,
  crearUsuario,
  mostrarFormularioEditar,
  editarUsuario,
  eliminarUsuario,
  mostrarUsuarios
};
