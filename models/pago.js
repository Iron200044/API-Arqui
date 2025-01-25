const mongoose = require("mongoose");

const PagoSchema = new mongoose.Schema({
  idPersona: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  fechaPago: { type: Date, required: true },
  monto: { type: Number, required: true },
  estado: { type: String, enum: ["Pagado", "Pendiente"], required: true },
});

module.exports = mongoose.model("Pago", PagoSchema);
