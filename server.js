require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyparser = require('body-parser');
// const verifyKeycloakToken = require("./middlewares/verifyKeycloakToken");

const { sequelize } = require('./models');
const { keycloak, memoryStore } = require('./middlewares/keycloak');
const swaggerDocs = require('./swagger');

const app = express();

// Configuración de middlewars generales

// Configuración de CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(bodyparser.json());
app.use(express.json());

//Middleware con exclusión manual de rutas públicas
// app.use((req, res, next) => {
//   const publicPaths = ["/api-docs", "/swagger-ui", "/swagger.json", "/"];
//   const isPublic = publicPaths.some((path) => req.path.startsWith(path));

//   if (isPublic) {
//     return next();
//   }

//   verifyKeycloakToken(req, res, next);
// });


// Configurar la sesión
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

// Inicializar Keycloak
app.use(keycloak.middleware());

// Conectar a la base de datos
sequelize.sync()
  .then(() => console.log('Base de datos conectada'))
  .catch((err) => console.error('Error al conectar a la base de datos:', err));


// Rutas públicas (sin autenticación)
app.get('/api/public', (req, res) => {
  res.json({ message: 'Esta es una ruta pública' });
});

// Importar rutas
const usuariosRoutes    = require("./routes/usuarios");
const clientesRoutes    = require("./routes/clientes");
const puntosSeguridadRoutes   = require("./routes/puntosSeguridad");
const rolesRoutes       = require("./routes/roles");
const empleadosRoutes   = require("./routes/empleados");
const turnosRoutes      = require("./routes/turnos");
const asistenciasRoutes = require("./routes/asistencias");
const horariosRotativosRoutes = require("./routes/horariosRotativos");

// Crear y proteger rutas
const rutasProtegidas = express.Router();
rutasProtegidas.use(usuariosRoutes);
rutasProtegidas.use(clientesRoutes);
rutasProtegidas.use(puntosSeguridadRoutes);
rutasProtegidas.use(rolesRoutes);
rutasProtegidas.use(empleadosRoutes);
rutasProtegidas.use(turnosRoutes);
rutasProtegidas.use(asistenciasRoutes);
rutasProtegidas.use(horariosRotativosRoutes);

// Proteger todas las rutas que empiecen con /api
app.use('/api', keycloak.protect('realm:admin'), rutasProtegidas);

swaggerDocs(app);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API Seguridad Funcionando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
