const mongoose = require("mongoose");

const ParticipacionSchema = new mongoose.Schema({
  idTorneo: { type: mongoose.Schema.Types.ObjectId, ref: "Torneo", required: true },
  idPersona: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  puestoObtenido: { type: Number, required: true },
});

module.exports = mongoose.model("Participacion", ParticipacionSchema);
