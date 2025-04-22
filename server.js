require("dotenv").config();
const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Configurar CORS
app.use(cors({
  origin: '*', // Ajusta esto para producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar la sesión (necesaria para keycloak-connect)
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Configurar Keycloak
const keycloak = new Keycloak({ store: session });

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
sequelize.sync().then(() => {
  console.log('Base de datos conectada');
}).catch((err) => {
  console.error('Error al conectar a la base de datos:', err);
});

// Proteger todas las rutas con Keycloak
app.use(keycloak.middleware());

// Ruta pública (sin autenticación)
app.get('/api/public', (req, res) => {
  res.json({ message: 'Esta es una ruta pública' });
});

// Ruta protegida (requiere autenticación)
app.get('/api/protected', keycloak.protect(), (req, res) => {
  res.json({ 
    message: 'Esta es una ruta protegida', 
    user: req.kauth.grant.access_token.content 
  });
});

// Ruta protegida solo para usuarios con rol "admin"
app.get('/api/admin', keycloak.protect('realm:admin'), (req, res) => {
  res.json({ 
    message: 'Esta es una ruta solo para admins', 
    user: req.kauth.grant.access_token.content 
  });
});
const helmet = require("helmet");

const swaggerDocs = require("./swagger"); // Importación correcta



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
