"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Asistencia extends Model {
    static associate(models) {
      Asistencia.belongsTo(models.Empleado, { foreignKey: "empleado_id", as: "empleado" });
      Asistencia.belongsTo(models.Turno, { foreignKey: "turno_id", as: "turno" });
    }
  }
  Asistencia.init(
    {
      empleado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "empleado_id", // Mapea explícitamente el campo a la columna en la base de datos
      },
      turno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora_ingreso: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      hora_salida: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Asistencia",
      tableName: "asistencias",
    }
  );
  return Asistencia;
};