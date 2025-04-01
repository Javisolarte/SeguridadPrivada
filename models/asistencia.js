const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Asistencia extends Model {
    static associate(models) {
      // Una asistencia pertenece a un empleado
      Asistencia.belongsTo(models.Empleado, {
        foreignKey: "empleadoId",
        as: "empleado",
      });
      // Una asistencia está asociada a un turno
      Asistencia.belongsTo(models.Turno, {
        foreignKey: "turnoId",
        as: "turno",
      });
    }
  }

  Asistencia.init(
    {
      fecha: DataTypes.DATE,
      estado: DataTypes.STRING, // Puede ser 'asistió', 'faltó', etc.
      empleadoId: DataTypes.INTEGER,
      turnoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Asistencia",
    }
  );

  return Asistencia;
};
