const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear el directorio si no existe
const excelUploadsDir = path.join(__dirname, '../public/uploads/excel');
if (!fs.existsSync(excelUploadsDir)) {
  fs.mkdirSync(excelUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, excelUploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // .xlsx o .xls
    cb(null, `categorias-${timestamp}${ext}`);
  }
});

const uploadExcel = multer({
  storage,
  fileFilter: function (req, file, cb) {
    // Solo aceptar archivos .xlsx o .xls
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
    }
    cb(null, true);
  }
});

module.exports = uploadExcel;
