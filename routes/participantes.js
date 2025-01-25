const express = require("express");
const router = express.Router();
const Participacion = require("../models/participacion");
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");

// Crear una nueva participación
router.post("/", async (req, res) => {
  const { idTorneo, idPersona, puestoObtenido } = req.body;

  try {
    // Validar datos requeridos
    if (!idTorneo || !idPersona || puestoObtenido == null) {
      return res
        .status(400)
        .json({ message: "idTorneo, idPersona y puestoObtenido son obligatorios" });
    }

    // Validar que el torneo y la persona existan
    const torneo = await Torneo.findById(idTorneo);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const persona = await Persona.findById(idPersona);
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    // Crear la participación
    const nuevaParticipacion = new Participacion({
      idTorneo,
      idPersona,
      puestoObtenido,
    });

    const participacionGuardada = await nuevaParticipacion.save();
    res.status(201).json(participacionGuardada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una participación
router.put("/:id", async (req, res) => {
  const { idTorneo, idPersona, puestoObtenido } = req.body;

  try {
    // Buscar la participación a actualizar
    const participacionExistente = await Participacion.findById(req.params.id);
    if (!participacionExistente) {
      return res.status(404).json({ message: "Participación no encontrada" });
    }

    // Validar que los IDs de torneo y persona existan si se van a actualizar
    if (idTorneo) {
      const torneo = await Torneo.findById(idTorneo);
      if (!torneo) {
        return res.status(404).json({ message: "Torneo no encontrado" });
      }
      participacionExistente.idTorneo = idTorneo;
    }

    if (idPersona) {
      const persona = await Persona.findById(idPersona);
      if (!persona) {
        return res.status(404).json({ message: "Persona no encontrada" });
      }
      participacionExistente.idPersona = idPersona;
    }

    if (puestoObtenido != null) {
      participacionExistente.puestoObtenido = puestoObtenido;
    }

    const participacionActualizada = await participacionExistente.save();
    res.status(200).json(participacionActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todas las participaciones
router.get("/", async (req, res) => {
  try {
    const participaciones = await Participacion.find()
      .populate("idTorneo", "nombre fecha") // Traer datos del torneo
      .populate("idPersona", "nombre edad"); // Traer datos de la persona
    res.status(200).json(participaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una participación por ID
router.get("/:id", async (req, res) => {
  try {
    const participacion = await Participacion.findById(req.params.id)
      .populate("idTorneo", "nombre fecha")
      .populate("idPersona", "nombre edad");

    if (!participacion) {
      return res.status(404).json({ message: "Participación no encontrada" });
    }
    res.status(200).json(participacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una participación
router.delete("/:id", async (req, res) => {
  try {
    const participacionEliminada = await Participacion.findByIdAndDelete(req.params.id);
    if (!participacionEliminada) {
      return res.status(404).json({ message: "Participación no encontrada" });
    }
    res.status(200).json({ message: "Participación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
