const jwt = require("jsonwebtoken");
const Usuario = require("../models").Usuario;

const registro = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const contraseñaEncriptada = await Usuario.encriptarContraseña(contraseña);
    const usuario = await Usuario.create({
      nombre,
      email,
      contraseña: contraseñaEncriptada,
      rol,
    });

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error });
  }
};

const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const esValido = await Usuario.validarContraseña(contraseña, usuario.contraseña);
    if (!esValido) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el inicio de sesión", error });
  }
};

module.exports = {
  registro,
  login,
};
