const express = require("express");
const router = express.Router();
const Pago = require("../models/pago");
const Persona = require("../models/persona");

const validarPago = ({ monto, estado, fechaPago }) => {
  const errores = [];

  // Validar monto
  if (monto <= 0) {
    errores.push("El monto debe ser un número positivo.");
  }

  // Validar estado
  if (!["Pagado", "Pendiente"].includes(estado)) {
    errores.push('El estado debe ser "Pagado" o "Pendiente".');
  }

  // Validar formato de fecha (YYYY-MM-DD)
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexFecha.test(fechaPago)) {
    errores.push("Formato de fecha inválido. Debe ser YYYY-MM-DD y solo usar '-'.");
  } else {
    // Validar si la fecha es real y no está en el futuro
    const fechaPagoObj = new Date(fechaPago);
    if (isNaN(fechaPagoObj.getTime())) {
      errores.push("Fecha de pago inválida.");
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaPagoObj > hoy) {
        errores.push("La fecha de pago no puede ser en el futuro.");
      }
    }
  }

  return errores;
};

// Crear un nuevo pago con validaciones
router.post("/", async (req, res) => {
  const { idPersona, monto, estado, fechaPago } = req.body;

  try {
    // Verificar si la persona existe
    const persona = await Persona.findById(idPersona);
    if (!persona) {
      return res.status(400).json({ message: "Persona no válida" });
    }

    // Validar el pago
    const errores = validarPago(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: errores });
    }

    // Crear el pago
    const nuevoPago = new Pago({ idPersona, monto, estado, fechaPago });
    const pagoGuardado = await nuevoPago.save();

    res.status(201).json(pagoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un pago con validaciones
router.put("/:id", async (req, res) => {
  try {
    const pagoExistente = await Pago.findById(req.params.id);
    if (!pagoExistente) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Obtener solo los campos enviados en la solicitud
    const camposAActualizar = {};
    if (req.body.monto !== undefined) {
      if (req.body.monto <= 0) {
        return res.status(400).json({ message: "El monto debe ser un número positivo." });
      }
      camposAActualizar.monto = req.body.monto;
    }

    if (req.body.estado !== undefined) {
      if (!["Pagado", "Pendiente"].includes(req.body.estado)) {
        return res.status(400).json({ message: 'El estado debe ser "Pagado" o "Pendiente".' });
      }
      camposAActualizar.estado = req.body.estado;
    }

    if (req.body.fechaPago !== undefined) {
      const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
      if (!regexFecha.test(req.body.fechaPago)) {
        return res.status(400).json({ message: "Formato de fecha inválido. Debe ser YYYY-MM-DD y solo usar '-'." });
      }
      const fechaPagoObj = new Date(req.body.fechaPago);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaPagoObj > hoy) {
        return res.status(400).json({ message: "La fecha de pago no puede ser en el futuro." });
      }
      camposAActualizar.fechaPago = req.body.fechaPago;
    }

    // Actualizar solo los campos que fueron modificados
    const pagoActualizado = await Pago.findByIdAndUpdate(req.params.id, camposAActualizar, { new: true });

    res.status(200).json(pagoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener pagos de una persona
router.get("/persona/:id", async (req, res) => {
  try {
    const idPersona = req.params.id;
    const pagos = await Pago.find({ idPersona });
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
