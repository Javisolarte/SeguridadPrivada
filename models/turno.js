const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Turno extends Model {
    static associate(models) {
      // Un turno pertenece a un solo empleado
      Turno.belongsTo(models.Empleado, {
        foreignKey: "empleadoId",
        as: "empleado",
      });
    }
  }

  Turno.init(
    {
      tipo: DataTypes.STRING, // Puede ser 'día' o 'noche'
      fecha: DataTypes.DATE,
      duracion: DataTypes.INTEGER, // En horas
      empleadoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Turno",
    }
  );

  return Turno;
};
