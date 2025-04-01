const express = require('express');
const router = express.Router();
const { Asistencia } = require('../models');

/**
 * @swagger
 * /asistencias:
 *   get:
 *     summary: Obtener todas las asistencias
 *     tags: [Asistencias]
 *     responses:
 *       200:
 *         description: Lista de asistencias
 */
router.get('/', async (req, res) => {
    const asistencias = await Asistencia.findAll();
    res.json(asistencias);
});

/**
 * @swagger
 * /asistencias:
 *   post:
 *     summary: Crear una nueva asistencia
 *     tags: [Asistencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asistencia'
 *     responses:
 *       201:
 *         description: Asistencia creada exitosamente
 */
router.post('/', async (req, res) => {
    const nuevaAsistencia = await Asistencia.create(req.body);
    res.status(201).json(nuevaAsistencia);
});

module.exports = router;
