const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class HorarioRotativo extends Model {}

  HorarioRotativo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      punto_seguridad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      empleado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      turno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "HorarioRotativo",
      tableName: "horarios_rotativos",
    }
  );

  return HorarioRotativo;
};