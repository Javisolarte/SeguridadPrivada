const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Cliente extends Model {}

  Cliente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      direccion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true, // Valida que el email tenga un formato correcto (si se proporciona)
        },
      },
    },
    {
      sequelize,
      modelName: "Cliente",
      tableName: "clientes",
    }
  );

  return Cliente;
};
