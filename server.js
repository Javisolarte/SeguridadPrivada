require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const swaggerDocs = require("./swagger"); // Importación correcta

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Importar rutas
const usuariosRoutes = require("./routes/usuarios");
app.use("/api", usuariosRoutes);

// Documentación Swagger (¡Importante! Debe ir después de las rutas)
swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("API Seguridad Funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
