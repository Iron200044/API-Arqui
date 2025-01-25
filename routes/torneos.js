const express = require("express");
const router = express.Router();
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");
const Participacion = require("../models/participacion");

// Crear un nuevo torneo
router.post("/", async (req, res) => {
  const { nombreTorneo, fecha} = req.body;

  try {
    // Crear el torneo
    const torneo = new Torneo({ nombreTorneo, fecha });

    const torneoGuardado = await torneo.save();

    res.status(201).json(torneoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un torneo
router.put("/:id", async (req, res) => {
  const { nombreTorneo, fecha} = req.body;

  try {
    // Buscar el torneo
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    // Actualizar el torneo
    torneo.nombreTorneo = nombreTorneo || torneo.nombreTorneo;
    torneo.fecha = fecha || torneo.fecha;
    await torneo.save();

    res.status(200).json(torneo);
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
