const express = require("express");
const router = express.Router();
const { Asistencia, Empleado, Turno } = require("../models/index");

// Middleware para validar datos
const validateAsistencia = (empleado_id, turno_id, fecha, hora_ingreso, hora_salida, estado) => {
  if (!Number.isInteger(empleado_id) || empleado_id < 1) {
    return "Empleado ID inválido";
  }
  if (!Number.isInteger(turno_id) || turno_id < 1) {
    return "Turno ID inválido";
  }
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return "Fecha inválida (formato esperado: YYYY-MM-DD)";
  }
  if (hora_ingreso && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora_ingreso)) {
    return "Hora de ingreso inválida (formato esperado: HH:MM)";
  }
  if (hora_salida && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora_salida)) {
    return "Hora de salida inválida (formato esperado: HH:MM)";
  }
  if (!estado || !["Presente", "Ausente", "Tarde"].includes(estado)) {
    return "Estado inválido (valores permitidos: Presente, Ausente, Tardes)";
  }
  return null;
};

// GET - Obtener todas las asistencias
/**
 * @swagger
 * /api/asistencias:
 *   get:
 *     summary: Obtiene todas las asistencias
 *     tags: [Asistencias]
 *     responses:
 *       200:
 *         description: Lista de asistencias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   empleado_id:
 *                     type: integer
 *                   turno_id:
 *                     type: integer
 *                   fecha:
 *                     type: string
 *                     format: date
 *                   hora_ingreso:
 *                     type: string
 *                     format: time
 *                   hora_salida:
 *                     type: string
 *                     format: time
 *                   estado:
 *                     type: string
 *                   empleadoAsistencia:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                   turnoAsistencia:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 */
router.get("/asistencias", async (req, res) => {
  try {
    const asistencias = await Asistencia.findAll({
      include: [
        { model: Empleado, as: "empleadoAsistencia" },
        { model: Turno, as: "turnoAsistencia" },
      ],
    });
    res.status(200).json(asistencias);
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    res.status(500).json({ error: "Error al obtener asistencias", details: error.message });
  }
});

// GET - Obtener una asistencia por ID
/**
 * @swagger
 * /api/asistencias/{id}:
 *   get:
 *     summary: Obtiene una asistencia por ID
 *      security:
 *       - keycloak: [openid]
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia a obtener
 *         
 *     responses:
 *       200:
 *         description: Asistencia obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 empleado_id:
 *                   type: integer
 *                 turno_id:
 *                   type: integer
 *                 fecha:
 *                   type: string
 *                   format: date
 *                 hora_ingreso:
 *                   type: string
 *                   format: time
 *                 hora_salida:
 *                   type: string
 *                   format: time
 *                 estado:
 *                   type: string
 *                 empleadoAsistencia:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                 turnoAsistencia:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Asistencia no encontrada
 */
router.get("/asistencias/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const asistencia = await Asistencia.findByPk(id, {
      include: [
        { model: Empleado, as: "empleadoAsistencia" },
        { model: Turno, as: "turnoAsistencia" },
      ],
    });
    if (!asistencia) {
      return res.status(404).json({ error: "Asistencia no encontrada" });
    }
    res.status(200).json(asistencia);
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    res.status(500).json({ error: "Error al obtener asistencia", details: error.message });
  }
});

// POST - Crear una nueva asistencia
/**
 * @swagger
 * /api/asistencias:
 *   post:
 *     summary: Crea una nueva asistencia
 *     tags: [Asistencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empleado_id
 *               - turno_id
 *               - fecha
 *               - estado
 *             properties:
 *               empleado_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_ingreso:
 *                 type: string
 *                 format: time
 *               hora_salida:
 *                 type: string
 *                 format: time
 *               estado:
 *                 type: string
 *                 enum: ["Presente", "Ausente", "Tarde"]
 *     responses:
 *       201:
 *         description: Asistencia creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear asistencia
 */
router.post("/asistencias", async (req, res) => {
  const { empleado_id, turno_id, fecha, hora_ingreso, hora_salida, estado } = req.body;

  const validationError = validateAsistencia(empleado_id, turno_id, fecha, hora_ingreso, hora_salida, estado);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const empleado = await Empleado.findByPk(empleado_id);
    if (!empleado) {
      return res.status(400).json({ error: "Empleado no encontrado" });
    }

    const turno = await Turno.findByPk(turno_id);
    if (!turno) {
      return res.status(400).json({ error: "Turno no encontrado" });
    }

    const nuevaAsistencia = await Asistencia.create({
      empleado_id,
      turno_id,
      fecha,
      hora_ingreso,
      hora_salida,
      estado,
    });
    res.status(201).json(nuevaAsistencia);
  } catch (error) {
    console.error("Error al crear asistencia:", error);
    res.status(500).json({ error: "Error al crear asistencia", details: error.message });
  }
});

// PUT - Actualizar una asistencia existente
/**
 * @swagger
 * /api/asistencias/{id}:
 *   put:
 *     summary: Actualiza una asistencia existente
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empleado_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_ingreso:
 *                 type: string
 *                 format: time
 *               hora_salida:
 *                 type: string
 *                 format: time
 *               estado:
 *                 type: string
 *                 enum: ["Presente", "Ausente", "Tarde"]
 *     responses:
 *       200:
 *         description: Asistencia actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Asistencia no encontrada
 *       500:
 *         description: Error al actualizar asistencia
 */
router.put("/asistencias/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { empleado_id, turno_id, fecha, hora_ingreso, hora_salida, estado } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const asistencia = await Asistencia.findByPk(id);
    if (!asistencia) {
      return res.status(404).json({ error: "Asistencia no encontrada" });
    }

    const validationError = validateAsistencia(
      empleado_id || asistencia.empleado_id,
      turno_id || asistencia.turno_id,
      fecha || asistencia.fecha,
      hora_ingreso || asistencia.hora_ingreso,
      hora_salida || asistencia.hora_salida,
      estado || asistencia.estado
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (empleado_id) {
      const empleado = await Empleado.findByPk(empleado_id);
      if (!empleado) {
        return res.status(400).json({ error: "Empleado no encontrado" });
      }
    }

    if (turno_id) {
      const turno = await Turno.findByPk(turno_id);
      if (!turno) {
        return res.status(400).json({ error: "Turno no encontrado" });
      }
    }

    await asistencia.update({
      empleado_id: empleado_id || asistencia.empleado_id,
      turno_id: turno_id || asistencia.turno_id,
      fecha: fecha || asistencia.fecha,
      hora_ingreso: hora_ingreso || asistencia.hora_ingreso,
      hora_salida: hora_salida || asistencia.hora_salida,
      estado: estado || asistencia.estado,
    });

    res.status(200).json(asistencia);
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    res.status(500).json({ error: "Error al actualizar asistencia", details: error.message });
  }
});

// DELETE - Eliminar una asistencia
/**
 * @swagger
 * /api/asistencias/{id}:
 *   delete:
 *     summary: Elimina una asistencia
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia a eliminar
 *     responses:
 *       204:
 *         description: Asistencia eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Asistencia no encontrada
 *       500:
 *         description: Error al eliminar asistencia
 */
router.delete("/asistencias/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const asistencia = await Asistencia.findByPk(id);
    if (!asistencia) {
      return res.status(404).json({ error: "Asistencia no encontrada" });
    }

    await asistencia.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar asistencia:", error);
    res.status(500).json({ error: "Error al eliminar asistencia", details: error.message });
  }
});

module.exports = router;