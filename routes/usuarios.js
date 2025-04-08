const express = require("express");
const router = express.Router();

// Array simulado como base de datos temporal
let usuarios = [{ id: 1, nombre: "Juan Pérez", email: "juan@example.com" }];

// GET - Obtener todos los usuarios
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     example: "Juan Pérez"
 *                   email:
 *                     type: string
 *                     example: "juan@example.com"
 */
router.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

// POST - Crear un nuevo usuario
/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "María López"
 *               email:
 *                 type: string
 *                 example: "maria@example.com"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Faltan datos requeridos
 */
router.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    email
  };
  
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// PUT - Actualizar un usuario existente
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez Actualizado"
 *               email:
 *                 type: string
 *                 example: "juan.actualizado@example.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
  
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  
  usuarios[usuarioIndex] = {
    ...usuarios[usuarioIndex],
    nombre: nombre || usuarios[usuarioIndex].nombre,
    email: email || usuarios[usuarioIndex].email
  };
  
  res.json(usuarios[usuarioIndex]);
});

// DELETE - Eliminar un usuario
/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
  
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  
  usuarios.splice(usuarioIndex, 1);
  res.status(204).send();
});

module.exports = router;