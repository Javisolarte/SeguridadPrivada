const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const empleadosRoutes = require('./routes/empleados');
const clientesRoutes = require('./routes/clientes');
const puntosRoutes = require('./routes/puntosSeguridad');
const turnosRoutes = require('./routes/turnos');
const asistenciasRoutes = require('./routes/asistencias');

const app = express();
app.use(express.json());
app.use(cors());
