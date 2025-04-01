const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido", error });
  }
};

module.exports = {
  verificarToken,
};
