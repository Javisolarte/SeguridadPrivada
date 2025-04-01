const express = require('express');
const router = express.Router();
const { PuntoSeguridad } = require('../models');

/**
 * @swagger
 * /puntosSeguridad:
 *   get:
 *     summary: Obtener todos los puntos de seguridad
 *     tags: [Puntos de Seguridad]
 *     responses:
 *       200:
 *         description: Lista de puntos de seguridad
 */
router.get('/', async (req, res) => {
    const puntos = await PuntoSeguridad.findAll();
    res.json(puntos);
});

/**
 * @swagger
 * /puntosSeguridad:
 *   post:
 *     summary: Crear un nuevo punto de seguridad
 *     tags: [Puntos de Seguridad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PuntoSeguridad'
 *     responses:
 *       201:
 *         description: Punto de seguridad creado exitosamente
 */
router.post('/', async (req, res) => {
    const nuevoPunto = await PuntoSeguridad.create(req.body);
    res.status(201).json(nuevoPunto);
});

module.exports = router;
