const mongoose = require("mongoose");

const ParticipacionSchema = new mongoose.Schema({
  idTorneo: { type: mongoose.Schema.Types.ObjectId, ref: "Torneo", required: true },
  idPersona: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  puestoObtenido: { type: Number, required: true },
  partidosJugados: { type: Number, required: true, default: 0 }, // Nuevo campo
  promedioParticipacion: { type: Number, required: true, default: 0 }, // Nuevo campo
});

module.exports = mongoose.model("Participacion", ParticipacionSchema);

