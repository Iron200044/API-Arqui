const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Asistencia = require("../models/asistencia");
const Persona = require("../models/persona");
const Entrenamiento = require("../models/entrenamiento");

// Middleware de validación de asistencia
const validarAsistencia = async (req, res, next) => {
  const { idPersona, idEntrenamiento, asistencia } = req.body;
  const errores = [];

  // Validar que idPersona sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(idPersona)) {
    errores.push("El ID de la persona no es válido.");
  } else {
    const persona = await Persona.findById(idPersona);
    if (!persona) errores.push("Persona no encontrada.");
  }

  // Validar que idEntrenamiento sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(idEntrenamiento)) {
    errores.push("El ID del entrenamiento no es válido.");
  } else {
    const entrenamiento = await Entrenamiento.findById(idEntrenamiento);
    if (!entrenamiento) errores.push("Entrenamiento no encontrado.");
  }

  // Validar que asistencia sea booleano
  if (typeof asistencia !== "boolean") {
    errores.push("El campo asistencia debe ser un valor booleano (true o false).");
  }

  if (errores.length > 0) {
    return res.status(400).json({ message: errores });
  }

  next();
};

// Crear una nueva asistencia
router.post("/", validarAsistencia, async (req, res) => {
  try {
    const nuevaAsistencia = new Asistencia(req.body);
    const asistenciaGuardada = await nuevaAsistencia.save();
    res.status(201).json(asistenciaGuardada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Actualizar una asistencia
router.put("/:id", async (req, res) => {
  try {
    const asistenciaExistente = await Asistencia.findById(req.params.id);
    if (!asistenciaExistente) {
      return res.status(404).json({ message: "Asistencia no encontrada" });
    }

    const { asistencia } = req.body;
    const camposAActualizar = {};

    if (asistencia !== undefined) {
      if (typeof asistencia !== "boolean") {
        return res.status(400).json({ message: "El campo asistencia debe ser un valor booleano (true o false)." });
      }
      camposAActualizar.asistencia = asistencia;
    }

    // Actualizar solo los campos proporcionados
    const asistenciaActualizada = await Asistencia.findByIdAndUpdate(req.params.id, camposAActualizar, { new: true });

    res.status(200).json(asistenciaActualizada);
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

// Obtener asistencias de una persona por su UID
router.get("/persona/uid/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Buscar la persona por su UID
    const persona = await Persona.findOne({ uid });

    if (!persona) {
      return res.status(404).json({ message: "No se encontró una persona con el UID proporcionado." });
    }

    // Buscar asistencias relacionadas con el ID de la persona encontrada
    const asistencias = await Asistencia.find({ idPersona: persona._id }).populate("idEntrenamiento");

    if (asistencias.length === 0) {
      return res.status(404).json({ message: "No se encontraron asistencias para esta persona." });
    }

    res.status(200).json(asistencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todas las asistencias a un entrenamiento por su ID
router.get("/entrenamiento/:id", async (req, res) => {
  try {
    const idEntrenamiento = req.params.id;

    // Buscar asistencias por ID de entrenamiento y poblar datos de las personas
    const asistencias = await Asistencia.find({ idEntrenamiento }).populate("idPersona");
    
    if (!asistencias.length) {
      return res.status(404).json({ message: "No se encontraron asistencias para este entrenamiento." });
    }

    res.status(200).json(asistencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
