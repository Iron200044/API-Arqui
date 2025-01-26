const mongoose = require("mongoose");

const TorneoSchema = new mongoose.Schema({
  nombreTorneo: { type: String, required: true },
  fecha: { type: Date, required: true },
  partidosTotales: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Torneo", TorneoSchema);
