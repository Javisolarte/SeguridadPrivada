const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Turno extends Model {}

  Turno.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Turno",
      tableName: "turnos",
    }
  );

  return Turno;
}; 