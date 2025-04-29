const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require('./middlewares/verificarToken');

app.get("/ruta-protegida", verificarToken, (req, res) => {
  res.json({ mensaje: "¡Token válido! Acceso permitido" });
});
router.post("/registro", authController.registro);
router.post("/login", authController.login);

module.exports = router;

