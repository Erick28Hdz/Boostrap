const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, enum: ['porcentaje', 'monto_fijo', '2x1'], required: true },
  valor: { type: Number },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },

  // Corrección aquí: Array de productos y categorías
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model('Promotion', promotionSchema);
