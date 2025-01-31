const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Persona = require("../models/persona");
const Entrenamiento = require("../models/entrenamiento");
const Asistencia = require("../models/asistencia");
const Pago = require("../models/pago");
const Participacion = require("../models/participacion");
const Torneo = require("../models/torneo");

// Función para validar los datos de la persona
const validarPersona = (datos) => {
  const errores = [];

  // Expresiones regulares
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Formato dd-mm-aaaa
  const regexTelefono = /^\d{10}$/; // Exactamente 10 números
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validar email
  const regexComillas = /["']/; // Detecta comillas simples o dobles

  // Validaciones
  if (!regexNombre.test(datos.nombre)) {
    errores.push("El nombre solo debe contener letras y espacios, sin caracteres especiales.");
  }
  if (!regexNombre.test(datos.apellido)) {
    errores.push("El apellido solo debe contener letras y espacios, sin caracteres especiales.");
  }
  if (!regexFecha.test(datos.fechaNacimiento)) {
    errores.push("La fecha de nacimiento debe estar en formato dd-mm-aaaa.");
  }
  if (!regexTelefono.test(datos.telefono)) {
    errores.push("El teléfono debe contener exactamente 10 dígitos numéricos.");
  }
  if (!regexEmail.test(datos.email)) {
    errores.push("El email debe ser válido (ejemplo@correo.com).");
  }
  if (regexComillas.test(datos.direccion)) {
    errores.push("Este campo no puede contener comillas ni ningun tipo de caracter especial.");
  }

  return errores;
};

// Crear una nueva persona
router.post("/", async (req, res) => {
  try {
    const errores = validarPersona(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    const nuevaPersona = new Persona(req.body);
    await nuevaPersona.save();
    res.status(201).json(nuevaPersona);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todas las personas
router.get("/", async (req, res) => {
    try {
      const personas = await Persona.find();
      res.status(200).json(personas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Obtener una persona por ID
router.get("/:id", async (req, res) => {
    try {
      const persona = await Persona.findById(req.params.id);
      if (!persona) return res.status(404).json({ message: "Persona no encontrada" });
      res.status(200).json(persona);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Obtener una persona por UID de Firebase
router.get("/uid/:uid", async (req, res) => {
  try {
      const persona = await Persona.findOne({ uid: req.params.uid });
      if (!persona) {
          return res.status(404).json({ message: "Persona no encontrada con ese UID" });
      }
      res.status(200).json(persona);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Obtener solo el rol de una persona por UID
router.get("/uid/:uid/role", async (req, res) => {
  try {
    const { uid } = req.params;

    // Buscar la persona por UID
    const persona = await Persona.findOne({ uid });
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada con ese UID" });
    }

    // Devolver solo el rol
    res.status(200).json({ role: persona.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener personas por rol
router.get("/role/:role", async (req, res) => {
  try {
    const { role } = req.params; // Extraer el rol de los parámetros de la ruta

    // Buscar personas que coincidan con el rol
    const personas = await Persona.find({ role });

    // Verificar si se encontraron personas con ese rol
    if (personas.length === 0) {
      return res.status(404).json({ message: "No se encontraron personas con este rol" });
    }

    res.status(200).json(personas); // Devolver las personas encontradas
  } catch (error) {
    res.status(500).json({ message: "Error al obtener personas", error: error.message });
  }
});

  
// Actualizar una persona
router.put("/:id", async (req, res) => {
  try {
    // Solo validamos los campos presentes en la solicitud
    const errores = [];

    if (req.body.nombre && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(req.body.nombre)) {
      errores.push("El nombre solo debe contener letras y espacios, sin caracteres especiales.");
    }

    if (req.body.apellido && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(req.body.apellido)) {
      errores.push("El apellido solo debe contener letras y espacios, sin caracteres especiales.");
    }

    if (req.body.fechaNacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.fechaNacimiento)) {
      errores.push("La fecha de nacimiento debe estar en formato dd-mm-aaaa.");
    }

    if (req.body.telefono && !/^\d{10}$/.test(req.body.telefono)) {
      errores.push("El teléfono debe contener exactamente 10 dígitos numéricos.");
    }

    if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
      errores.push("El email debe ser válido (ejemplo@correo.com).");
    }

    if (req.body.direccion && /["']/.test(req.body.direccion)) {
      errores.push("Este campo no puede contener comillas ni ningun tipo de caracter especial.");
    }

    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    // Buscar la persona por ID
    const persona = await Persona.findById(req.params.id);
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    // Actualizamos solo los campos proporcionados
    const { nombre, apellido, fechaNacimiento, telefono, direccion, email } = req.body;

    if (nombre) persona.nombre = nombre;
    if (apellido) persona.apellido = apellido;
    if (fechaNacimiento) persona.fechaNacimiento = fechaNacimiento;
    if (telefono) persona.telefono = telefono;
    if (direccion) persona.direccion = direccion;
    if (email) persona.email = email;

    // Guardamos la persona actualizada
    const personaActualizada = await persona.save();
    res.status(200).json(personaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

  // Obtener toda la información de una persona
router.get("/:id/detalles", async (req, res) => {
    try {
      const personaId = req.params.id;
  
      // Buscar la persona
      const persona = await Persona.findById(personaId);
      if (!persona) return res.status(404).json({ message: "Persona no encontrada" });
  
      // Consultar las entidades relacionadas
      const entrenamientos = await Entrenamiento.find();
      const asistencias = await Asistencia.find({ idPersona: personaId }).populate("idEntrenamiento");
      const pagos = await Pago.find({ idPersona: personaId });
      const participaciones = await Participacion.find({ idPersona: personaId }).populate("idTorneo");
      const torneos = participaciones.map((participacion) => participacion.idTorneo);
  
      // Crear respuesta consolidada
      const respuesta = {
        persona,
        entrenamientos,
        asistencias,
        pagos,
        participaciones,
        torneos,
      };
  
      res.status(200).json(respuesta);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;