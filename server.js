require("dotenv").config();
const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const verifyKeycloakToken = require("./middlewares/verifyKeycloakToken");
const swaggerDocs = require("./swagger");
const { sequelize } = require("./models");

// Configuración de Keycloak
const keycloakConfig = JSON.parse(fs.readFileSync("./keycloak.json"));
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

const app = express();

// Configuración de CORS para mejorar la seguridad y permitir múltiples dominios
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4200"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Configuración de sesión con una clave secreta más segura y ajustes recomendados
app.use(session({
  secret: process.env.SESSION_SECRET || "una-clave-secreta",
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  cookie: { secure: process.env.NODE_ENV === "production" } // Solo usar cookies seguras en producción
}));

// Inicializar Keycloak y parseadores
app.use(keycloak.middleware());
app.use(bodyParser.json());
app.use(express.json());

// Middleware para proteger rutas con token (excepto las públicas)
const publicPaths = ["/api-docs", "/swagger-ui", "/swagger.json", "/api/public"];
app.use((req, res, next) => {
  if (publicPaths.some((path) => req.path.startsWith(path))) return next();
  verifyKeycloakToken(req, res, next);
});

// Conectar a la base de datos con manejo adecuado de errores
sequelize.sync()
  .then(() => console.log("Base de datos conectada correctamente"))
  .catch((err) => console.error("Error al conectar a la base de datos:", err));

// Rutas públicas
app.get("/api/public", (req, res) => {
  res.json({ message: "Esta es una ruta pública" });
});

// Importar y agrupar rutas protegidas
const rutasProtegidas = express.Router();

const rutas = [
  "usuarios",
  "clientes",
  "puntosSeguridad",
  "roles",
  "empleados",
  "turnos",
  "asistencias",
  "horariosRotativos"
];

rutas.forEach((ruta) => {
  rutasProtegidas.use(require(`./routes/${ruta}`));
});

// Aplicar middleware para proteger todas las rutas dentro de `/api`
app.use("/api", verifyKeycloakToken, rutasProtegidas);

// Documentación Swagger
swaggerDocs(app);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API Seguridad Funcionando 🚀");
});

// Iniciar servidor de manera segura
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});