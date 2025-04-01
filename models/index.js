const Empleado = require("./empleado");
const Turno = require("./turno");
const Asistencia = require("./asistencia");
const Cliente = require("./cliente");
const Minuta = require("./minuta");

Empleado.hasMany(Turno, { foreignKey: "empleadoId" });
Turno.belongsTo(Empleado, { foreignKey: "empleadoId" });

Empleado.hasMany(Asistencia, { foreignKey: "empleadoId" });
Asistencia.belongsTo(Empleado, { foreignKey: "empleadoId" });

Turno.hasMany(Asistencia, { foreignKey: "turnoId" });
Asistencia.belongsTo(Turno, { foreignKey: "turnoId" });

Cliente.hasMany(Turno, { foreignKey: "clienteId" });
Turno.belongsTo(Cliente, { foreignKey: "clienteId" });

Empleado.hasMany(Minuta, { foreignKey: "empleadoId" });
Minuta.belongsTo(Empleado, { foreignKey: "empleadoId" });

Turno.hasMany(Minuta, { foreignKey: "turnoId" });
Minuta.belongsTo(Turno, { foreignKey: "turnoId" });
