const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Participacion = require("../models/participacion");
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");

const validarParticipacion = async ({ idTorneo, idPersona, puestoObtenido, partidosJugados }) => {
  let errores = [];

  if (!idTorneo) errores.push("El campo idTorneo es obligatorio.");
  if (!idPersona) errores.push("El campo idPersona es obligatorio.");
  if (puestoObtenido == null) errores.push("El campo puestoObtenido es obligatorio.");
  if (partidosJugados == null) errores.push("El campo partidosJugados es obligatorio.");

  // Validar puestoObtenido
  if (puestoObtenido < 1) errores.push("El puesto obtenido debe ser mayor o igual a 1.");

  // Validar partidosJugados
  if (partidosJugados < 0) errores.push("El número de partidos jugados no puede ser negativo.");

  // Verificar si el torneo existe y obtener sus datos
  const torneo = await Torneo.findById(idTorneo);
  if (!torneo) {
    errores.push("El torneo no existe.");
  } else if (torneo.partidosTotales <= 0) {
    errores.push("El torneo debe tener un número válido de partidos totales.");
  } else if (partidosJugados > torneo.partidosTotales) {
    errores.push("Los partidos jugados no pueden superar los partidos totales del torneo.");
  }

  // Verificar si la persona existe
  const persona = await Persona.findById(idPersona);
  if (!persona) errores.push("La persona no existe.");

  return errores;
};

//Crear una nueva participación
router.post("/", async (req, res) => {
  try {
    const errores = await validarParticipacion(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    const { idTorneo, idPersona, puestoObtenido, partidosJugados } = req.body;
    const torneo = await Torneo.findById(idTorneo);

    const nuevaParticipacion = new Participacion({
      idTorneo,
      idPersona,
      puestoObtenido,
      partidosJugados,
      promedioParticipacion: partidosJugados / torneo.partidosTotales,
    });

    const participacionGuardada = await nuevaParticipacion.save();
    res.status(201).json(participacionGuardada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Actualizar una participacion
router.put("/:id", async (req, res) => {
  try {
    const participacionExistente = await Participacion.findById(req.params.id);
    if (!participacionExistente) {
      return res.status(404).json({ message: "Participación no encontrada." });
    }

    // Validar los nuevos datos antes de actualizar
    const errores = await validarParticipacion(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    const { idTorneo, idPersona, puestoObtenido, partidosJugados } = req.body;

    if (idTorneo) participacionExistente.idTorneo = idTorneo;
    if (idPersona) participacionExistente.idPersona = idPersona;
    if (puestoObtenido != null) participacionExistente.puestoObtenido = puestoObtenido;
    if (partidosJugados != null) participacionExistente.partidosJugados = partidosJugados;

    // Recalcular promedio
    const torneoActual = await Torneo.findById(participacionExistente.idTorneo);
    if (torneoActual && torneoActual.partidosTotales > 0) {
      participacionExistente.promedioParticipacion =
        participacionExistente.partidosJugados / torneoActual.partidosTotales;
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

// Obtener todas las participaciones de una persona por su UID
router.get("/persona/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Buscar la persona por su UID
    const persona = await Persona.findOne({ uid });

    if (!persona) {
      return res.status(404).json({ message: "No se encontró una persona con el UID proporcionado." });
    }

    // Buscar todas las participaciones asociadas al ID de la persona encontrada
    const participaciones = await Participacion.find({ idPersona: persona._id })
      .populate("idTorneo", "nombre fecha") // Datos adicionales del torneo
      .populate("idPersona", "nombre edad"); // Datos adicionales de la persona

    if (participaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron participaciones para esta persona." });
    }

    res.status(200).json(participaciones);
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
