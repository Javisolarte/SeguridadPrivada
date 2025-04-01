const express = require('express');
const router = express.Router();
const { Turno } = require('../models');

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', async (req, res) => {
    const turnos = await Turno.findAll();
    res.json(turnos);
});

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 */
router.post('/', async (req, res) => {
    const nuevoTurno = await Turno.create(req.body);
    res.status(201).json(nuevoTurno);
});

module.exports = router;
