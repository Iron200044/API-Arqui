const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sacerogarcia:RhFb4Fh1miLzZSYM@apidb.bj0a5dr.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Detener la aplicación si hay un error de conexión
  }
};

module.exports = connectDB;