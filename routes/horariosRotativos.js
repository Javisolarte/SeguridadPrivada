const express = require("express");
const router = express.Router();
const { HorarioRotativo, PuntoSeguridad, Empleado, Turno } = require("../models/index");

// Middleware para validar datos
const validateHorarioRotativo = (punto_seguridad_id, empleado_id, turno_id, fecha) => {
  if (!Number.isInteger(punto_seguridad_id) || punto_seguridad_id < 1) {
    return "Punto de seguridad ID inválido";
  }
  if (!Number.isInteger(empleado_id) || empleado_id < 1) {
    return "Empleado ID inválido";
  }
  if (!Number.isInteger(turno_id) || turno_id < 1) {
    return "Turno ID inválido";
  }
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return "Fecha inválida (formato esperado: YYYY-MM-DD)";
  }
  return null;
};

// GET - Obtener todos los horarios rotativos
/**
 * @swagger
 * /api/horarios-rotativos:
 *   get:
 *     summary: Obtiene todos los horarios rotativos
 *     tags: [HorariosRotativos]
 *     responses:
 *       200:
 *         description: Lista de horarios rotativos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   punto_seguridad_id:
 *                     type: integer
 *                   empleado_id:
 *                     type: integer
 *                   turno_id:
 *                     type: integer
 *                   fecha:
 *                     type: string
 *                     format: date
 *                   puntoSeguridad:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                   empleado:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                   turno:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 */
router.get("/horarios-rotativos", async (req, res) => {
  try {
    const horarios = await HorarioRotativo.findAll({
      include: [
        { model: PuntoSeguridad, as: "puntoSeguridad" },
        { model: Empleado, as: "empleado" },
        { model: Turno, as: "turno" },
      ],
    });
    res.status(200).json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios rotativos:", error);
    res.status(500).json({ error: "Error al obtener horarios rotativos", details: error.message });
  }
});

// GET - Obtener un horario rotativo por ID
/**
 * @swagger
 * /api/horarios-rotativos/{id}:
 *   get:
 *     summary: Obtiene un horario rotativo por ID
 *     tags: [HorariosRotativos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario rotativo
 *     responses:
 *       200:
 *         description: Horario rotativo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 punto_seguridad_id:
 *                   type: integer
 *                 empleado_id:
 *                   type: integer
 *                 turno_id:
 *                   type: integer
 *                 fecha:
 *                   type: string
 *                   format: date
 *                 puntoSeguridad:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                 empleado:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                 turno:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Horario rotativo no encontrado
 */
router.get("/horarios-rotativos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const horario = await HorarioRotativo.findByPk(id, {
      include: [
        { model: PuntoSeguridad, as: "puntoSeguridad" },
        { model: Empleado, as: "empleado" },
        { model: Turno, as: "turno" },
      ],
    });
    if (!horario) {
      return res.status(404).json({ error: "Horario rotativo no encontrado" });
    }
    res.status(200).json(horario);
  } catch (error) {
    console.error("Error al obtener horario rotativo:", error);
    res.status(500).json({ error: "Error al obtener horario rotativo", details: error.message });
  }
});

// POST - Crear un nuevo horario rotativo
/**
 * @swagger
 * /api/horarios-rotativos:
 *   post:
 *     summary: Crea un nuevo horario rotativo
 *     tags: [HorariosRotativos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - punto_seguridad_id
 *               - empleado_id
 *               - turno_id
 *               - fecha
 *             properties:
 *               punto_seguridad_id:
 *                 type: integer
 *               empleado_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Horario rotativo creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear horario rotativo
 */
router.post("/horarios-rotativos", async (req, res) => {
  const { punto_seguridad_id, empleado_id, turno_id, fecha } = req.body;

  const validationError = validateHorarioRotativo(punto_seguridad_id, empleado_id, turno_id, fecha);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const puntoSeguridad = await PuntoSeguridad.findByPk(punto_seguridad_id);
    if (!puntoSeguridad) {
      return res.status(400).json({ error: "Punto de seguridad no encontrado" });
    }

    const empleado = await Empleado.findByPk(empleado_id);
    if (!empleado) {
      return res.status(400).json({ error: "Empleado no encontrado" });
    }

    const turno = await Turno.findByPk(turno_id);
    if (!turno) {
      return res.status(400).json({ error: "Turno no encontrado" });
    }

    const nuevoHorario = await HorarioRotativo.create({
      punto_seguridad_id,
      empleado_id,
      turno_id,
      fecha,
    });
    res.status(201).json(nuevoHorario);
  } catch (error) {
    console.error("Error al crear horario rotativo:", error);
    res.status(500).json({ error: "Error al crear horario rotativo", details: error.message });
  }
});

// PUT - Actualizar un horario rotativo existente
/**
 * @swagger
 * /api/horarios-rotativos/{id}:
 *   put:
 *     summary: Actualiza un horario rotativo existente
 *     tags: [HorariosRotativos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario rotativo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               punto_seguridad_id:
 *                 type: integer
 *               empleado_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Horario rotativo actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Horario rotativo no encontrado
 *       500:
 *         description: Error al actualizar horario rotativo
 */
router.put("/horarios-rotativos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { punto_seguridad_id, empleado_id, turno_id, fecha } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const horario = await HorarioRotativo.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horario rotativo no encontrado" });
    }

    const validationError = validateHorarioRotativo(
      punto_seguridad_id || horario.punto_seguridad_id,
      empleado_id || horario.empleado_id,
      turno_id || horario.turno_id,
      fecha || horario.fecha
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (punto_seguridad_id) {
      const puntoSeguridad = await PuntoSeguridad.findByPk(punto_seguridad_id);
      if (!puntoSeguridad) {
        return res.status(400).json({ error: "Punto de seguridad no encontrado" });
      }
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

    await horario.update({
      punto_seguridad_id: punto_seguridad_id || horario.punto_seguridad_id,
      empleado_id: empleado_id || horario.empleado_id,
      turno_id: turno_id || horario.turno_id,
      fecha: fecha || horario.fecha,
    });

    res.status(200).json(horario);
  } catch (error) {
    console.error("Error al actualizar horario rotativo:", error);
    res.status(500).json({ error: "Error al actualizar horario rotativo", details: error.message });
  }
});

// DELETE - Eliminar un horario rotativo
/**
 * @swagger
 * /api/horarios-rotativos/{id}:
 *   delete:
 *     summary: Elimina un horario rotativo
 *     tags: [HorariosRotativos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario rotativo a eliminar
 *     responses:
 *       204:
 *         description: Horario rotativo eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Horario rotativo no encontrado
 *       500:
 *         description: Error al eliminar horario rotativo
 */
router.delete("/horarios-rotativos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const horario = await HorarioRotativo.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horario rotativo no encontrado" });
    }

    await horario.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar horario rotativo:", error);
    res.status(500).json({ error: "Error al eliminar horario rotativo", details: error.message });
  }
});

module.exports = router;