const mongoose = require('mongoose');

const publicidadSchema = new mongoose.Schema({
  imagen: { type: String, required: true }, // Ruta de la imagen subida
  titulo: { type: String },
  descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('publicidad', publicidadSchema);
