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

const clientesRoutes = require("./routes/clientes");
app.use("/api", clientesRoutes);

const puntosSeguridadRoutes = require("./routes/puntosSeguridad");
app.use("/api", puntosSeguridadRoutes);


const rolesRoutes = require("./routes/roles"); // Nuevas rutas para roles
app.use("/api", rolesRoutes);

const empleadosRoutes = require("./routes/empleados");
app.use("/api", empleadosRoutes);




const turnosRoutes = require("./routes/turnos"); // Nuevas rutas para turnos
const asistenciasRoutes = require("./routes/asistencias"); // Nuevas rutas para asistencias
const horariosRotativosRoutes = require("./routes/horariosRotativos"); // Nuevas rutas para horarios rotativos


app.use("/api", turnosRoutes);
app.use("/api", asistenciasRoutes);
app.use("/api", horariosRotativosRoutes);
// Documentación Swagger (¡Importante! Debe ir después de las rutas)
swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("API Seguridad Funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
