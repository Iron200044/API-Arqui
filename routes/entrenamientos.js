const express = require("express");
const router = express.Router();
const Entrenamiento = require("../models/entrenamiento");
const Persona = require("../models/persona");

// Crear un nuevo entrenamiento
router.post("/", async (req, res) => {
  const { nombre, fecha, duracion } = req.body;

  try {
    // Crear el entrenamiento
    const nuevoEntrenamiento = new Entrenamiento({
      nombre,
      fecha,
      duracion,
    });

    const entrenamientoGuardado = await nuevoEntrenamiento.save();
    res.status(201).json(entrenamientoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un entrenamiento
router.put("/:id", async (req, res) => {
  const { nombre, fecha, duracion } = req.body;

  try {
    const entrenamientoExistente = await Entrenamiento.findById(req.params.id);
    if (!entrenamientoExistente) {
      return res.status(404).json({ message: "Entrenamiento no encontrado" });
    }

    entrenamientoExistente.nombre = nombre || entrenamientoExistente.nombre;
    entrenamientoExistente.fecha = fecha || entrenamientoExistente.fecha;
    entrenamientoExistente.duracion = duracion || entrenamientoExistente.duracion;

    await entrenamientoExistente.save();

    res.status(200).json(entrenamientoExistente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los entrenamientos
router.get("/", async (req, res) => {
  try {
    const entrenamientos = await Entrenamiento.find();
    res.status(200).json(entrenamientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
