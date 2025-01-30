const mongoose = require("mongoose");

const TorneoSchema = new mongoose.Schema({
  nombreTorneo: { type: String, required: true },
  fecha: { type: Date, required: true },
  partidosTotales: { type: Number, required: true, default: 0 },
});

// Middleware para convertir fecha antes de guardar
TorneoSchema.pre("save", function (next) {
  if (typeof this.fecha === "string") {
    const partes = this.fecha.split("-");
    this.fecha = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`); // Convierte dd-mm-aaaa a Date
  }
  next();
});

module.exports = mongoose.model("Torneo", TorneoSchema);
