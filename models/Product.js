const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },         // Título del producto
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  foto: { type: String, required: false },           // URL o nombre de la imagen
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);