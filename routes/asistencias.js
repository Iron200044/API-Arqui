const express = require("express");
const router = express.Router();
const Asistencia = require("../models/asistencia");
const Persona = require("../models/persona");
const Entrenamiento = require("../models/entrenamiento");

// Crear una nueva asistencia
router.post("/", async (req, res) => {
  const { idPersona, idEntrenamiento, asistencia } = req.body;

  try {
    // Verificar si la persona y el entrenamiento existen
    const persona = await Persona.findById(idPersona);
    const entrenamiento = await Entrenamiento.findById(idEntrenamiento);

    if (!persona || !entrenamiento) {
      return res.status(400).json({ message: "Persona o Entrenamiento no válido" });
    }

    // Crear la asistencia
    const nuevaAsistencia = new Asistencia({
      idPersona,
      idEntrenamiento,
      asistencia,
    });

    const asistenciaGuardada = await nuevaAsistencia.save();
    res.status(201).json(asistenciaGuardada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una asistencia
router.put("/:id", async (req, res) => {
  const { asistencia } = req.body;

  try {
    const asistenciaExistente = await Asistencia.findById(req.params.id);
    if (!asistenciaExistente) {
      return res.status(404).json({ message: "Asistencia no encontrada" });
    }

    asistenciaExistente.asistencia = asistencia || asistenciaExistente.asistencia;
    await asistenciaExistente.save();

    res.status(200).json(asistenciaExistente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener asistencias de una persona
router.get("/persona/:id", async (req, res) => {
  try {
    const idPersona = req.params.id;
    const asistencias = await Asistencia.find({ idPersona }).populate("idEntrenamiento");
    res.status(200).json(asistencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
