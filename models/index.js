const { Sequelize } = require("sequelize");

// Configura Sequelize usando las variables de entorno definidas en docker-compose.yml
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

// Importa los modelos
const PuntoSeguridad = require("./puntoSeguridad")(sequelize);
const Empleado = require("./empleado")(sequelize);
const Turno = require("./turno")(sequelize);
const Asistencia = require("./asistencia")(sequelize);
const Cliente = require("./cliente")(sequelize);
const Minuta = require("./minuta")(sequelize);
const Rol = require("./rol")(sequelize);

// Define las relaciones
const models = {
  Empleado,
  Turno,
  Asistencia,
  Cliente,
  Minuta,
  PuntoSeguridad,
  Rol,
};

// Relaciones existentes
Empleado.hasMany(Turno, { foreignKey: "empleadoId", onDelete: "CASCADE", as: "turnos" });
Turno.belongsTo(Empleado, { foreignKey: "empleadoId", as: "empleadoTurno" });

Empleado.hasMany(Asistencia, { foreignKey: "empleadoId", onDelete: "CASCADE", as: "asistencias" });
Asistencia.belongsTo(Empleado, { foreignKey: "empleadoId", as: "empleadoAsistencia" });

Turno.hasMany(Asistencia, { foreignKey: "turnoId", onDelete: "CASCADE", as: "asistenciasTurno" });
Asistencia.belongsTo(Turno, { foreignKey: "turnoId", as: "turnoAsistencia" });

Cliente.hasMany(Turno, { foreignKey: "clienteId", onDelete: "CASCADE", as: "turnosCliente" });
Turno.belongsTo(Cliente, { foreignKey: "clienteId", as: "clienteTurno" });

Empleado.hasMany(Minuta, { foreignKey: "empleadoId", onDelete: "CASCADE", as: "minutas" });
Minuta.belongsTo(Empleado, { foreignKey: "empleadoId", as: "empleadoMinuta" });

Turno.hasMany(Minuta, { foreignKey: "turnoId", onDelete: "CASCADE", as: "minutasTurno" });
Minuta.belongsTo(Turno, { foreignKey: "turnoId", as: "turnoMinuta" });

Cliente.hasMany(PuntoSeguridad, { foreignKey: "cliente_id", onDelete: "CASCADE", as: "puntosSeguridad" });
PuntoSeguridad.belongsTo(Cliente, { foreignKey: "cliente_id", as: "clientePunto" });

Rol.hasMany(Empleado, { foreignKey: "rol_id", onDelete: "RESTRICT", as: "empleados" });
Empleado.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

// Ejecuta el método associate de cada modelo (si existe)
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Exporta los modelos y la conexión
module.exports = {
  sequelize,
  Sequelize,
  Empleado,
  Turno,
  Asistencia,
  Cliente,
  Minuta,
  PuntoSeguridad,
  Rol,
};