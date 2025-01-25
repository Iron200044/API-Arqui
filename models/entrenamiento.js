const mongoose = require("mongoose");

const EntrenamientoSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
});

module.exports = mongoose.model("Entrenamiento", EntrenamientoSchema);
