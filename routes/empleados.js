const express = require("express");
const router = express.Router();
const { Empleado, Rol } = require("../models/index");

// Middleware para validar datos
const validateEmpleado = (data) => {
  const {
    nombre,
    apellidos,
    cedula,
    rol_id,
    estado_civil,
    escolaridad,
    email,
    edad,
    ingreso,
  } = data;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return "Nombre inválido o ausente";
  }
  if (!apellidos || typeof apellidos !== "string" || apellidos.trim() === "") {
    return "Apellidos inválidos o ausentes";
  }
  if (!cedula || typeof cedula !== "string" || cedula.trim() === "") {
    return "Cédula inválida o ausente";
  }
  if (!Number.isInteger(rol_id) || rol_id < 1) {
    return "Rol ID inválido";
  }
  if (estado_civil && !["Soltero", "Casado", "Union Libre"].includes(estado_civil)) {
    return "Estado civil inválido";
  }
  if (escolaridad && !["Primaria", "Secundaria", "Pregrado", "Postgrado"].includes(escolaridad)) {
    return "Escolaridad inválida";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email inválido";
  }
  if (edad && (!Number.isInteger(edad) || edad < 0)) {
    return "Edad inválida";
  }
  if (ingreso && (isNaN(ingreso) || ingreso < 0)) {
    return "Ingreso inválido";
  }
  return null;
};

// GET - Obtener todos los empleados
/**
 * @swagger
 * /api/empleados:
 *   get:
 *     summary: Obtiene todos los empleados
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   puesto:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   apellidos:
 *                     type: string
 *                   cedula:
 *                     type: string
 *                   rol:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 */
router.get("/empleados", async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{ model: Rol, as: "rol" }],
    });
    res.status(200).json(empleados);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados", details: error.message });
  }
});

// GET - Obtener un empleado por ID
/**
 * @swagger
 * /api/empleados/{id}:
 *   get:
 *     summary: Obtiene un empleado por ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 puesto:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 cedula:
 *                   type: string
 *                 rol:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Empleado no encontrado
 */
router.get("/empleados/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const empleado = await Empleado.findByPk(id, {
      include: [{ model: Rol, as: "rol" }],
    });
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json(empleado);
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ error: "Error al obtener empleado", details: error.message });
  }
});

// POST - Crear un nuevo empleado
/**
 * @swagger
 * /api/empleados:
 *   post:
 *     summary: Crea un nuevo empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - cedula
 *               - rol_id
 *             properties:
 *               puesto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               cedula:
 *                 type: string
 *               rh:
 *                 type: string
 *               activo:
 *                 type: boolean
 *               fecha_expedicion:
 *                 type: string
 *                 format: date
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               lugar_nacimiento:
 *                 type: string
 *               lugar_expedicion:
 *                 type: string
 *               edad:
 *                 type: integer
 *               estado_civil:
 *                 type: string
 *                 enum: ["Soltero", "Casado", "Union Libre"]
 *               escolaridad:
 *                 type: string
 *                 enum: ["Primaria", "Secundaria", "Pregrado", "Postgrado"]
 *               curso_vigilancia:
 *                 type: string
 *               fecha_vencimiento_curso:
 *                 type: string
 *                 format: date
 *               direccion:
 *                 type: string
 *               telefono1:
 *                 type: string
 *               email:
 *                 type: string
 *               arl:
 *                 type: string
 *               eps:
 *                 type: string
 *               pension:
 *                 type: string
 *               cargo:
 *                 type: string
 *               medio_tiempo:
 *                 type: boolean
 *               tiempo_completo:
 *                 type: boolean
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_finalizacion:
 *                 type: string
 *                 format: date
 *               ingreso:
 *                 type: number
 *               rol_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear empleado
 */
router.post("/empleados", async (req, res) => {
  const {
    puesto,
    nombre,
    apellidos,
    cedula,
    rh,
    activo,
    fecha_expedicion,
    fecha_nacimiento,
    lugar_nacimiento,
    lugar_expedicion,
    edad,
    estado_civil,
    escolaridad,
    curso_vigilancia,
    fecha_vencimiento_curso,
    direccion,
    telefono1,
    email,
    arl,
    eps,
    pension,
    cargo,
    medio_tiempo,
    tiempo_completo,
    fecha_inicio,
    fecha_finalizacion,
    ingreso,
    rol_id,
  } = req.body;

  const validationError = validateEmpleado({
    nombre,
    apellidos,
    cedula,
    rol_id,
    estado_civil,
    escolaridad,
    email,
    edad,
    ingreso,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
      return res.status(400).json({ error: "Rol no encontrado" });
    }

    const nuevoEmpleado = await Empleado.create({
      puesto,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      cedula: cedula.trim(),
      rh,
      activo,
      fecha_expedicion,
      fecha_nacimiento,
      lugar_nacimiento,
      lugar_expedicion,
      edad,
      estado_civil,
      escolaridad,
      curso_vigilancia,
      fecha_vencimiento_curso,
      direccion,
      telefono1,
      email,
      arl,
      eps,
      pension,
      cargo,
      medio_tiempo,
      tiempo_completo,
      fecha_inicio,
      fecha_finalizacion,
      ingreso,
      rol_id,
    });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ error: "Error al crear empleado", details: error.message });
  }
});

// PUT - Actualizar un empleado existente
/**
 * @swagger
 * /api/empleados/{id}:
 *   put:
 *     summary: Actualiza un empleado existente
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               puesto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               cedula:
 *                 type: string
 *               rh:
 *                 type: string
 *               activo:
 *                 type: boolean
 *               fecha_expedicion:
 *                 type: string
 *                 format: date
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               lugar_nacimiento:
 *                 type: string
 *               lugar_expedicion:
 *                 type: string
 *               edad:
 *                 type: integer
 *               estado_civil:
 *                 type: string
 *               escolaridad:
 *                 type: string
 *               curso_vigilancia:
 *                 type: string
 *               fecha_vencimiento_curso:
 *                 type: string
 *                 format: date
 *               direccion:
 *                 type: string
 *               telefono1:
 *                 type: string
 *               email:
 *                 type: string
 *               arl:
 *                 type: string
 *               eps:
 *                 type: string
 *               pension:
 *                 type: string
 *               cargo:
 *                 type: string
 *               medio_tiempo:
 *                 type: boolean
 *               tiempo_completo:
 *                 type: boolean
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_finalizacion:
 *                 type: string
 *                 format: date
 *               ingreso:
 *                 type: number
 *               rol_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error al actualizar empleado
 */
router.put("/empleados/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    puesto,
    nombre,
    apellidos,
    cedula,
    rh,
    activo,
    fecha_expedicion,
    fecha_nacimiento,
    lugar_nacimiento,
    lugar_expedicion,
    edad,
    estado_civil,
    escolaridad,
    curso_vigilancia,
    fecha_vencimiento_curso,
    direccion,
    telefono1,
    email,
    arl,
    eps,
    pension,
    cargo,
    medio_tiempo,
    tiempo_completo,
    fecha_inicio,
    fecha_finalizacion,
    ingreso,
    rol_id,
  } = req.body;

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    const validationError = validateEmpleado({
      nombre: nombre || empleado.nombre,
      apellidos: apellidos || empleado.apellidos,
      cedula: cedula || empleado.cedula,
      rol_id: rol_id || empleado.rol_id,
      estado_civil: estado_civil || empleado.estado_civil,
      escolaridad: escolaridad || empleado.escolaridad,
      email: email || empleado.email,
      edad: edad || empleado.edad,
      ingreso: ingreso || empleado.ingreso,
    });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (rol_id) {
      const rol = await Rol.findByPk(rol_id);
      if (!rol) {
        return res.status(400).json({ error: "Rol no encontrado" });
      }
    }

    await empleado.update({
      puesto: puesto || empleado.puesto,
      nombre: nombre ? nombre.trim() : empleado.nombre,
      apellidos: apellidos ? apellidos.trim() : empleado.apellidos,
      cedula: cedula ? cedula.trim() : empleado.cedula,
      rh: rh || empleado.rh,
      activo: activo !== undefined ? activo : empleado.activo,
      fecha_expedicion: fecha_expedicion || empleado.fecha_expedicion,
      fecha_nacimiento: fecha_nacimiento || empleado.fecha_nacimiento,
      lugar_nacimiento: lugar_nacimiento || empleado.lugar_nacimiento,
      lugar_expedicion: lugar_expedicion || empleado.lugar_expedicion,
      edad: edad || empleado.edad,
      estado_civil: estado_civil || empleado.estado_civil,
      escolaridad: escolaridad || empleado.escolaridad,
      curso_vigilancia: curso_vigilancia || empleado.curso_vigilancia,
      fecha_vencimiento_curso: fecha_vencimiento_curso || empleado.fecha_vencimiento_curso,
      direccion: direccion || empleado.direccion,
      telefono1: telefono1 || empleado.telefono1,
      email: email || empleado.email,
      arl: arl || empleado.arl,
      eps: eps || empleado.eps,
      pension: pension || empleado.pension,
      cargo: cargo || empleado.cargo,
      medio_tiempo: medio_tiempo !== undefined ? medio_tiempo : empleado.medio_tiempo,
      tiempo_completo: tiempo_completo !== undefined ? tiempo_completo : empleado.tiempo_completo,
      fecha_inicio: fecha_inicio || empleado.fecha_inicio,
      fecha_finalizacion: fecha_finalizacion || empleado.fecha_finalizacion,
      ingreso: ingreso || empleado.ingreso,
      rol_id: rol_id || empleado.rol_id,
    });

    res.status(200).json(empleado);
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado", details: error.message });
  }
});

// DELETE - Eliminar un empleado
/**
 * @swagger
 * /api/empleados/{id}:
 *   delete:
 *     summary: Elimina un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado a eliminar
 *     responses:
 *       204:
 *         description: Empleado eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error al eliminar empleado
 */
router.delete("/empleados/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    await empleado.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado", details: error.message });
  }
});

module.exports = router;