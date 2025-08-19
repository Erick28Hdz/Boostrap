const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear el directorio si no existe
const productosUploadsDir = path.join(__dirname, '../public/uploads/productos');
if (!fs.existsSync(productosUploadsDir)) {
  fs.mkdirSync(productosUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productosUploadsDir);
  },
  filename: function (req, file, cb) {
    const productoId = req.params.id || Date.now(); // Usa ID del producto o timestamp
    const ext = path.extname(file.originalname);
    cb(null, `${productoId}${ext}`);
  }
});

const uploadProducto = multer({ storage });

module.exports = uploadProducto;
