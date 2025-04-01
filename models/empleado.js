const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Empleado extends Model {
    static associate(models) {
      // Un empleado puede tener muchos turnos
      Empleado.hasMany(models.Turno, {
        foreignKey: "empleadoId",
        as: "turnos",
      });
      // Un empleado puede tener muchas asistencias
      Empleado.hasMany(models.Asistencia, {
        foreignKey: "empleadoId",
        as: "asistencias",
      });
    }
  }

  Empleado.init(
    {
      nombre: DataTypes.STRING,
      cedula: DataTypes.STRING,
      cargo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Empleado",
    }
  );

  return Empleado;
};
