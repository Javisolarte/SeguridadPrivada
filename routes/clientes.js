const express = require("express");
const router = express.Router();
const { Cliente } = require("../models/index");

// Middleware para validar datos
const validateCliente = (nombre, email, telefono) => {
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return "Nombre inválido o ausente";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email inválido";
  }
  if (telefono && !/^\d{7,15}$/.test(telefono)) {
    return "Teléfono inválido (debe tener entre 7 y 15 dígitos)";
  }
  return null;
};

// GET - Obtener todos los clientes
/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
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
 *                   nombre:
 *                     type: string
 *                     example: "Cliente 1"
 *                   direccion:
 *                     type: string
 *                     example: "Calle 123"
 *                   telefono:
 *                     type: string
 *                     example: "1234567890"
 *                   email:
 *                     type: string
 *                     example: "cliente1@example.com"
 */
router.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// POST - Crear un nuevo cliente
/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
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
 *                 example: "Cliente 1"
 *               direccion:
 *                 type: string
 *                 example: "Calle 123"
 *               telefono:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: "cliente1@example.com"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 */
router.post("/clientes", async (req, res) => {
  const { nombre, direccion, telefono, email } = req.body;

  const validationError = validateCliente(nombre, email, telefono);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const nuevoCliente = await Cliente.create({
      nombre: nombre.trim(),
      direccion: direccion ? direccion.trim() : null,
      telefono: telefono ? telefono.trim() : null,
      email: email ? email.toLowerCase() : null,
    });
    res.status(201).json(nuevoCliente);
  }catch (error) {
    res.status(400).json({ error: "Error al crear cliente", details: error.message });
  }
});

// PUT - Actualizar un cliente existente
/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Cliente 1 Actualizado"
 *               direccion:
 *                 type: string
 *                 example: "Calle 456"
 *               telefono:
 *                 type: string
 *                 example: "0987654321"
 *               email:
 *                 type: string
 *                 example: "cliente1.actualizado@example.com"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, direccion, telefono, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    if (nombre || email || telefono) {
      const validationError = validateCliente(
        nombre || cliente.nombre,
        email || cliente.email,
        telefono || cliente.telefono
      );
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
    }

    await cliente.update({
      nombre: nombre ? nombre.trim() : cliente.nombre,
      direccion: direccion ? direccion.trim() : cliente.direccion,
      telefono: telefono ? telefono.trim() : cliente.telefono,
      email: email ? email.toLowerCase() : cliente.email,
    });

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
});

// DELETE - Eliminar un cliente
/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a eliminar
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/clientes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
});

module.exports = router;