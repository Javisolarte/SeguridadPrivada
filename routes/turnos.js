const express = require("express");
const router = express.Router();
const { Turno } = require("../models/index");

// Middleware para validar datos
const validateTurno = (nombre, hora_inicio, hora_fin) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return "Nombre inválido o ausente";
  }
  if (!hora_inicio || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora_inicio)) {
    return "Hora de inicio inválida (formato esperado: HH:MM)";
  }
  if (!hora_fin || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora_fin)) {
    return "Hora de fin inválida (formato esperado: HH:MM)";
  }
  return null;
};

// GET - Obtener todos los turnos
/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Obtiene todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   hora_inicio:
 *                     type: string
 *                     format: time
 *                   hora_fin:
 *                     type: string
 *                     format: time
 */
router.get("/turnos", async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    res.status(200).json(turnos);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({ error: "Error al obtener turnos", details: error.message });
  }
});

// GET - Obtener un turno por ID
/**
 * @swagger
 * /api/turnos/{id}:
 *   get:
 *     summary: Obtiene un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 hora_inicio:
 *                   type: string
 *                   format: time
 *                 hora_fin:
 *                   type: string
 *                   format: time
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turno no encontrado
 */
router.get("/turnos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
  
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ error: "ID inválido" });
    }
  
    try {
      const turno = await Turno.findByPk(id, {
        include: [
          { model: Asistencia, as: "asistenciasTurno" }, // Usa el alias correcto
        ],
      });
      if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }
      res.status(200).json(turno);
    } catch (error) {
      console.error("Error al obtener turno:", error);
      res.status(500).json({ error: "Error al obtener turno", details: error.message });
    }
  });

// POST - Crear un nuevo turno
/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - hora_inicio
 *               - hora_fin
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Turno Mañana"
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 example: "08:00"
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 example: "16:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear turno
 */
router.post("/turnos", async (req, res) => {
  const { nombre, hora_inicio, hora_fin } = req.body;

  const validationError = validateTurno(nombre, hora_inicio, hora_fin);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const nuevoTurno = await Turno.create({
      nombre: nombre.trim(),
      hora_inicio,
      hora_fin,
    });
    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({ error: "Error al crear turno", details: error.message });
  }
});

// PUT - Actualizar un turno existente
/**
 * @swagger
 * /api/turnos/{id}:
 *   put:
 *     summary: Actualiza un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Turno Mañana Actualizado"
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error al actualizar turno
 */
router.put("/turnos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, hora_inicio, hora_fin } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    if (nombre || hora_inicio || hora_fin) {
      const validationError = validateTurno(
        nombre || turno.nombre,
        hora_inicio || turno.hora_inicio,
        hora_fin || turno.hora_fin
      );
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
    }

    await turno.update({
      nombre: nombre ? nombre.trim() : turno.nombre,
      hora_inicio: hora_inicio || turno.hora_inicio,
      hora_fin: hora_fin || turno.hora_fin,
    });

    res.status(200).json(turno);
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    res.status(500).json({ error: "Error al actualizar turno", details: error.message });
  }
});

// DELETE - Eliminar un turno
/**
 * @swagger
 * /api/turnos/{id}:
 *   delete:
 *     summary: Elimina un turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a eliminar
 *     responses:
 *       204:
 *         description: Turno eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error al eliminar turno
 */
router.delete("/turnos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    await turno.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(500).json({ error: "Error al eliminar turno", details: error.message });
  }
});

module.exports = router;