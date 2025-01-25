const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

//Conectar a la base de datos
connectDB();

//Midleware para parsea a el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: '*',
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS method
      credentials: true, // If you're using cookies or sessions
    })
  );

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Hola mundo');
});


// Rutas
app.use("/personas", require("./routes/personas"));
app.use("/torneos", require("./routes/torneos"));
app.use("/participaciones", require("./routes/participantes"));
app.use("/pagos", require("./routes/pagos"));
app.use("/asistencias", require("./routes/asistencias"));
app.use("/entrenamientos", require("./routes/entrenamientos"));

// Servidor corriendo
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

