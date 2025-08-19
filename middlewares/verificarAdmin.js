// middlewares/verificarAdmin.js
module.exports = (req, res, next) => {
  if (req.usuario.rol.nombre !== 'admin') {
    return res.redirect('/dashboard');
  }
  next();
};