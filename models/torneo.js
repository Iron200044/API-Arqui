const mongoose = require("mongoose");

const TorneoSchema = new mongoose.Schema({
  nombreTorneo: { type: String, required: true },
  fecha: { type: Date, required: true },
});

module.exports = mongoose.model("Torneo", TorneoSchema);
