const express = require("express");
const router = express.Router();
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");
const Participacion = require("../models/participacion");

// Crear un nuevo torneo
router.post("/", async (req, res) => {
  const { nombreTorneo, fecha, idParticipante } = req.body;

  try {
    // Crear el torneo
    const torneo = new Torneo({ nombreTorneo, fecha });

    // Verificar si los participantes existen
    const participantes = await Persona.find({ '_id': { $in: idParticipante } });

    if (participantes.length === 0) {
      return res.status(400).json({ message: "No se encontraron participantes" });
    }

    const torneoGuardado = await torneo.save();

    // Crear las participaciones
    idParticipante.forEach(async (id) => {
      const participacion = new Participacion({
        idPersona: id,
        idTorneo: torneoGuardado._id,
      });
      await participacion.save();
    });

    res.status(201).json(torneoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un torneo
router.put("/:id", async (req, res) => {
  const { nombreTorneo, fecha, idParticipante } = req.body;

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

    // Actualizar participaciones si es necesario
    if (idParticipante) {
      // Eliminar participaciones antiguas
      await Participacion.deleteMany({ idTorneo: req.params.id });

      // Crear nuevas participaciones
      idParticipante.forEach(async (id) => {
        const participacion = new Participacion({
          idPersona: id,
          idTorneo: torneo._id,
        });
        await participacion.save();
      });
    }

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
