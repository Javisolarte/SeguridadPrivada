const express = require("express");
const router = express.Router();
const { Rol } = require("../models/index");

// Middleware para validar datos
const validateRol = (nombre) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return "Nombre inválido o ausente";
  }
  return null;
};

// GET - Obtener todos los roles
/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
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
 */
router.get("/roles", async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ error: "Error al obtener roles", details: error.message });
  }
});

// GET - Obtener un rol por ID
/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtiene un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Rol no encontrado
 */
router.get("/roles/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).json({ error: "Error al obtener rol", details: error.message });
  }
});

// POST - Crear un nuevo rol
/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Administrador"
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear rol
 */
router.post("/roles", async (req, res) => {
  const { nombre } = req.body;

  const validationError = validateRol(nombre);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const nuevoRol = await Rol.create({
      nombre: nombre.trim(),
    });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ error: "Error al crear rol", details: error.message });
  }
});

// PUT - Actualizar un rol existente
/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Administrador Actualizado"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al actualizar rol
 */
router.put("/roles/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    if (nombre) {
      const validationError = validateRol(nombre);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
    }

    await rol.update({
      nombre: nombre ? nombre.trim() : rol.nombre,
    });

    res.status(200).json(rol);
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ error: "Error al actualizar rol", details: error.message });
  }
});

// DELETE - Eliminar un rol
/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Elimina un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       204:
 *         description: Rol eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al eliminar rol
 */
router.delete("/roles/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    await rol.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ error: "Error al eliminar rol", details: error.message });
  }
});

module.exports = router;