const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Torneo = require("../models/torneo");
const Persona = require("../models/persona");
const Participacion = require("../models/participacion");

// Función para validar los datos del torneo
const validarTorneo = (datos) => {
  const errores = [];

  // Expresiones regulares
  const regexNombreTorneo = /^[a-zA-Z0-9\s]+$/; // Solo letras, números y espacios
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Formato dd-mm-aaaa
  const regexNumero = /^\d+$/; // Solo números positivos
  const regexComillas = /["']/; // Detecta comillas simples o dobles

  // Validaciones
  if (!datos.nombreTorneo || !datos.fecha || datos.partidosTotales === undefined) {
    errores.push("Todos los campos son obligatorios: nombreTorneo, fecha y partidosTotales.");
  }
  if (!regexNombreTorneo.test(datos.nombreTorneo)) {
    errores.push("El nombre del torneo solo debe contener letras, números y espacios.");
  }
  if (!regexFecha.test(datos.fecha)) {
    errores.push("La fecha debe estar en formato dd-mm-aaaa.");
  }
  if (!regexNumero.test(datos.partidosTotales) || datos.partidosTotales < 0) {
    errores.push("Los partidos totales deben ser un número entero mayor o igual a 0.");
  }
  if (regexComillas.test(datos.nombreTorneo)) {
    errores.push("El nombre del torneo no debe contener comillas ni ningun tipo de caracter especial.");
  }

  return errores;
};

// Crear un nuevo torneo
router.post("/", async (req, res) => {
  try {
    const errores = validarTorneo(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    const torneo = new Torneo(req.body);
    const torneoGuardado = await torneo.save();
    res.status(201).json(torneoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un torneo
router.put("/actualizar/:id", async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const errores = validarTorneo(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }
    
    Object.assign(torneo, req.body);
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
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json(torneo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un torneo por ID
router.delete("/:id", async (req, res) => {
  try {
    const torneoEliminado = await Torneo.findByIdAndDelete(req.params.id);
    if (!torneoEliminado) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json({ message: "Torneo eliminado con éxito", torneo: torneoEliminado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
