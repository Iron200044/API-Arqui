const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Entrenamiento = require("../models/entrenamiento");

// Middleware de validación
const validarEntrenamiento = (req, res, next) => {
  const { fecha, hora } = req.body;

  // Validar campos requeridos
  if (!fecha || !hora) {
    return res.status(400).json({ message: "Fecha y hora son obligatorios" });
  }

  // Validar formato de fecha (DD-MM-YYYY y solo con "-")
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexFecha.test(fecha)) {
    return res.status(400).json({ message: "Formato de fecha inválido. Debe ser YYYY-MM-DD y solo usar '-'" });
  }

  // Validar si la fecha es real
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    return res.status(400).json({ message: "Fecha inválida" });
  }

  // No permitir fechas en el pasado
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaObj < hoy) {
    return res.status(400).json({ message: "No se pueden registrar entrenamientos en el pasado" });
  }

  // Validar formato de hora (HH:MM y solo con ":")
  const regexHora = /^\d{2}:\d{2}$/;
  if (!regexHora.test(hora)) {
    return res.status(400).json({ message: "Formato de hora inválido. Debe ser HH:MM y solo usar ':'" });
  }

  next();
};

// Crear un nuevo entrenamiento
router.post("/", validarEntrenamiento, async (req, res) => {
  try {
    const nuevoEntrenamiento = new Entrenamiento(req.body);
    const entrenamientoGuardado = await nuevoEntrenamiento.save();
    res.status(201).json(entrenamientoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un entrenamiento
router.put("/:id", async (req, res) => {
  const { fecha, hora } = req.body;

  try {
    // Buscar el entrenamiento a actualizar
    const entrenamientoExistente = await Entrenamiento.findById(req.params.id);
    if (!entrenamientoExistente) {
      return res.status(404).json({ message: "Entrenamiento no encontrado" });
    }

    // Actualizar solo los campos proporcionados
    if (fecha) entrenamientoExistente.fecha = fecha;
    if (hora) entrenamientoExistente.hora = hora;

    const entrenamientoActualizado = await entrenamientoExistente.save();
    res.status(200).json(entrenamientoActualizado);
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

// Obtener un entrenamiento por ID
router.get("/:id", async (req, res) => {
  try {
    const entrenamiento = await Entrenamiento.findById(req.params.id);
    if (!entrenamiento) {
      return res.status(404).json({ message: "Entrenamiento no encontrado" });
    }
    res.status(200).json(entrenamiento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar entrenamientos por fecha
router.get("/buscar/fecha/:fecha", async (req, res) => {
  try {
    const entrenamientos = await Entrenamiento.find({ fecha: req.params.fecha });
    if (entrenamientos.length === 0) {
      return res.status(404).json({ message: "No se encontraron entrenamientos en la fecha indicada" });
    }
    res.status(200).json(entrenamientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar entrenamientos por hora
router.get("/buscar/hora/:hora", async (req, res) => {
  try {
    const entrenamientos = await Entrenamiento.find({ hora: req.params.hora });
    if (entrenamientos.length === 0) {
      return res.status(404).json({ message: "No se encontraron entrenamientos en la hora indicada" });
    }
    res.status(200).json(entrenamientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un entrenamiento
router.delete("/:id", async (req, res) => {
  try {
    const entrenamientoEliminado = await Entrenamiento.findByIdAndDelete(req.params.id);
    if (!entrenamientoEliminado) {
      return res.status(404).json({ message: "Entrenamiento no encontrado" });
    }
    res.status(200).json({ message: "Entrenamiento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;