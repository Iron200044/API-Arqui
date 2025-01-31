const mongoose = require("mongoose");

const PersonaSchema = new mongoose.Schema({
  uid:{type:String, required:true},
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, default: "user" },
});

module.exports = mongoose.model("Persona", PersonaSchema);