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

app.use(express.json());

// Rutas
app.use("/api/personas", require("./routes/persona"));
app.use("/api/torneos", require("./routes/torneos"));
app.use("/api/participaciones", require("./routes/participacion"));
app.use("/api/pagos", require("./routes/pagos"));
app.use("/api/asistencias", require("./routes/asistencias"));
app.use("/api/entrenamientos", require("./routes/entrenamientos"));


