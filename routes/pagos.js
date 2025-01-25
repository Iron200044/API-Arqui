const express = require("express");
const router = express.Router();
const Pago = require("../models/pago");
const Persona = require("../models/persona");

// Crear un nuevo pago
router.post("/", async (req, res) => {
  const { idPersona, monto, estado, fechaPago } = req.body;

  try {
    // Verificar si la persona existe
    const persona = await Persona.findById(idPersona);
    if (!persona) {
      return res.status(400).json({ message: "Persona no válida" });
    }

    // Crear el pago
    const nuevoPago = new Pago({
      idPersona,
      monto,
      estado,
      fechaPago,
    });

    const pagoGuardado = await nuevoPago.save();
    res.status(201).json(pagoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un pago
router.put("/:id", async (req, res) => {
  const { monto, estado, fechaPago } = req.body;

  try {
    const pagoExistente = await Pago.findById(req.params.id);
    if (!pagoExistente) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    pagoExistente.monto = monto || pagoExistente.monto;
    pagoExistente.estado = estado || pagoExistente.estado;
    pagoExistente.fechaPago = fechaPago || pagoExistente.fechaPago;

    await pagoExistente.save();

    res.status(200).json(pagoExistente);
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
