const express = require("express");
const router = express.Router();
const { PuntoSeguridad, Cliente } = require("../models/index");

// Middleware para validar datos
const validatePuntoSeguridad = (nombre, cantidad_guardas, cliente_id) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return "Nombre inválido o ausente";
  }
  if (!Number.isInteger(cantidad_guardas) || cantidad_guardas < 1) {
    return "Cantidad de guardas debe ser un entero mayor a 0";
  }
  if (!Number.isInteger(cliente_id) || cliente_id < 1) {
    return "Cliente ID inválido";
  }
  return null;
};

// GET - Obtener todos los puntos de seguridad
/**
 * @swagger
 * /api/puntos-seguridad:
 *   get:
 *     summary: Obtiene todos los puntos de seguridad
 *     tags: [PuntosSeguridad]
 *     responses:
 *       200:
 *         description: Lista de puntos de seguridad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   cliente_id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Punto Central"
 *                   cantidad_guardas:
 *                     type: integer
 *                     example: 3
 *                   clientePunto:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       direccion:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       email:
 *                         type: string
 *       500:
 *         description: Error al obtener puntos de seguridad
 */
router.get("/puntos-seguridad", async (req, res) => {
  try {
    const puntos = await PuntoSeguridad.findAll({
      include: [
        {
          model: Cliente,
          as: "clientePunto",
          required: false, // LEFT JOIN para incluir puntos incluso si el cliente no existe
        },
      ],
    });
    res.status(200).json(puntos);
  } catch (error) {
    console.error("Error al obtener puntos de seguridad:", error);
    res.status(500).json({ error: "Error al obtener puntos de seguridad", details: error.message });
  }
});

// GET - Obtener un punto de seguridad por ID
/**
 * @swagger
 * /api/puntos-seguridad/{id}:
 *   get:
 *     summary: Obtiene un punto de seguridad por ID
 *     tags: [PuntosSeguridad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del punto de seguridad
 *     responses:
 *       200:
 *         description: Punto de seguridad obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 cliente_id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 cantidad_guardas:
 *                   type: integer
 *                 clientePunto:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Punto de seguridad no encontrado
 *       500:
 *         description: Error al obtener punto de seguridad
 */
router.get("/puntos-seguridad/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const punto = await PuntoSeguridad.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "clientePunto",
          required: false, // LEFT JOIN para incluir el punto incluso si el cliente no existe
        },
      ],
    });
    if (!punto) {
      return res.status(404).json({ error: "Punto de seguridad no encontrado" });
    }
    res.status(200).json(punto);
  } catch (error) {
    console.error("Error al obtener punto de seguridad:", error);
    res.status(500).json({ error: "Error al obtener punto de seguridad", details: error.message });
  }
});

// GET - Obtener puntos de seguridad por cliente
/**
 * @swagger
 * /api/puntos-seguridad/cliente/{clienteId}:
 *   get:
 *     summary: Obtiene todos los puntos de seguridad de un cliente
 *     tags: [PuntosSeguridad]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de puntos de seguridad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente_id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   cantidad_guardas:
 *                     type: integer
 *                   clientePunto:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       direccion:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: ID de cliente inválido
 *       500:
 *         description: Error al obtener puntos de seguridad
 */
router.get("/puntos-seguridad/cliente/:clienteId", async (req, res) => {
  const clienteId = parseInt(req.params.clienteId);

  if (isNaN(clienteId) || clienteId < 1) {
    return res.status(400).json({ error: "ID de cliente inválido" });
  }

  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const puntos = await PuntoSeguridad.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: Cliente,
          as: "clientePunto",
          required: false,
        },
      ],
    });
    res.status(200).json(puntos);
  } catch (error) {
    console.error("Error al obtener puntos de seguridad por cliente:", error);
    res.status(500).json({ error: "Error al obtener puntos de seguridad por cliente", details: error.message });
  }
});

// POST - Crear un nuevo punto de seguridad
/**
 * @swagger
 * /api/puntos-seguridad:
 *   post:
 *     summary: Crea un nuevo punto de seguridad
 *     tags: [PuntosSeguridad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - nombre
 *               - cantidad_guardas
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Punto Central"
 *               cantidad_guardas:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Punto de seguridad creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 cliente_id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 cantidad_guardas:
 *                   type: integer
 *       400:
 *         description: Datos inválidos o cliente no encontrado
 *       500:
 *         description: Error al crear punto de seguridad
 */
router.post("/puntos-seguridad", async (req, res) => {
  const { cliente_id, nombre, cantidad_guardas } = req.body;

  const validationError = validatePuntoSeguridad(nombre, cantidad_guardas, cliente_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(400).json({ error: "Cliente no encontrado" });
    }

    const nuevoPunto = await PuntoSeguridad.create({
      cliente_id,
      nombre: nombre.trim(),
      cantidad_guardas,
    });
    res.status(201).json(nuevoPunto);
  } catch (error) {
    console.error("Error al crear punto de seguridad:", error);
    res.status(500).json({ error: "Error al crear punto de seguridad", details: error.message });
  }
});

// PUT - Actualizar un punto de seguridad existente
/**
 * @swagger
 * /api/puntos-seguridad/{id}:
 *   put:
 *     summary: Actualiza un punto de seguridad existente
 *     tags: [PuntosSeguridad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del punto de seguridad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Punto Central Actualizado"
 *               cantidad_guardas:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Punto de seguridad actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 cliente_id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 cantidad_guardas:
 *                   type: integer
 *       400:
 *         description: Datos inválidos o cliente no encontrado
 *       404:
 *         description: Punto de seguridad no encontrado
 *       500:
 *         description: Error al actualizar punto de seguridad
 */
router.put("/puntos-seguridad/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { cliente_id, nombre, cantidad_guardas } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const punto = await PuntoSeguridad.findByPk(id);
    if (!punto) {
      return res.status(404).json({ error: "Punto de seguridad no encontrado" });
    }

    if (cliente_id || nombre || cantidad_guardas) {
      const validationError = validatePuntoSeguridad(
        nombre || punto.nombre,
        cantidad_guardas || punto.cantidad_guardas,
        cliente_id || punto.cliente_id
      );
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
    }

    if (cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        return res.status(400).json({ error: "Cliente no encontrado" });
      }
    }

    await punto.update({
      cliente_id: cliente_id || punto.cliente_id,
      nombre: nombre ? nombre.trim() : punto.nombre,
      cantidad_guardas: cantidad_guardas || punto.cantidad_guardas,
    });

    res.status(200).json(punto);
  } catch (error) {
    console.error("Error al actualizar punto de seguridad:", error);
    res.status(500).json({ error: "Error al actualizar punto de seguridad", details: error.message });
  }
});

// DELETE - Eliminar un punto de seguridad
/**
 * @swagger
 * /api/puntos-seguridad/{id}:
 *   delete:
 *     summary: Elimina un punto de seguridad
 *     tags: [PuntosSeguridad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del punto de seguridad a eliminar
 *     responses:
 *       204:
 *         description: Punto de seguridad eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Punto de seguridad no encontrado
 *       500:
 *         description: Error al eliminar punto de seguridad
 */
router.delete("/puntos-seguridad/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const punto = await PuntoSeguridad.findByPk(id);
    if (!punto) {
      return res.status(404).json({ error: "Punto de seguridad no encontrado" });
    }

    await punto.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar punto de seguridad:", error);
    res.status(500).json({ error: "Error al eliminar punto de seguridad", details: error.message });
  }
});

module.exports = router;