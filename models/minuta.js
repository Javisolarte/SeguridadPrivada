const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Minuta extends Model {
    static associate(models) {
      // Una minuta pertenece a un empleado
      Minuta.belongsTo(models.Empleado, {
        foreignKey: "empleadoId",
        as: "empleado",
      });
      // Una minuta está asociada a un turno
      Minuta.belongsTo(models.Turno, {
        foreignKey: "turnoId",
        as: "turno",
      });
    }
  }

  Minuta.init(
    {
      observaciones: DataTypes.STRING,
      empleadoId: DataTypes.INTEGER,
      turnoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Minuta",
    }
  );

  return Minuta;
};
