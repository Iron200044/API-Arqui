const express = require("express");
const router = express.Router();
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");
const Participacion = require("../models/participacion");

// Crear un nuevo torneo
router.post("/", async (req, res) => {
  const { nombreTorneo, fecha, partidosTotales } = req.body;

  try {
    if (!nombreTorneo || !fecha || partidosTotales == null) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios: nombreTorneo, fecha y partidosTotales" });
    }

    // Crear el torneo con todos los campos
    const torneo = new Torneo({ nombreTorneo, fecha, partidosTotales });
    const torneoGuardado = await torneo.save();

    res.status(201).json(torneoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un torneo
router.put("/:id", async (req, res) => {
  const { nombreTorneo, fecha, partidosTotales } = req.body;

  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    // Actualizar campos si están presentes
    if (nombreTorneo) torneo.nombreTorneo = nombreTorneo;
    if (fecha) torneo.fecha = fecha;
    if (partidosTotales != null) torneo.partidosTotales = partidosTotales;

    const torneoActualizado = await torneo.save();
    res.status(200).json(torneoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los torneos
router.get("/", async (req, res) => {
  try {
    const torneos = await Torneo.find(); // Devuelve todos los torneos
    res.status(200).json(torneos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un torneo por su ID
router.get("/:id", async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id).populate("idParticipante");
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json(torneo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
