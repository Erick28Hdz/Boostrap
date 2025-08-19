const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Conectado a MongoDB desde db.js');
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
