const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Reemplaza con tu cadena de conexión
    const uri = "mongodb+srv://sacerogarcia:sCeAUjNvLcYX726@cluster0.ox7dn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Tiempo máximo para conectarse al servidor
    });

    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Finaliza el proceso en caso de error
  }
};

module.exports = connectDB;