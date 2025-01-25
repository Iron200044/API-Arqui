const mongoose = require("mongoose");

const AsistenciaSchema = new mongoose.Schema({
  idPersona: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  idEntrenamiento: { type: mongoose.Schema.Types.ObjectId, ref: "Entrenamiento", required: true },
  asistencia: { type: Boolean, required: true },
});

module.exports = mongoose.model("Asistencia", AsistenciaSchema);
