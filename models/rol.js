const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Rol extends Model {}

  Rol.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Rol",
      tableName: "roles",
    }
  );

  return Rol;
};