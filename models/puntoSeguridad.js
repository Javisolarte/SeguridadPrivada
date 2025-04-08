const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PuntoSeguridad extends Model {}

  PuntoSeguridad.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clientes",
          key: "id",
        },
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cantidad_guardas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: "PuntoSeguridad",
      tableName: "puntos_seguridad",
    }
  );

  return PuntoSeguridad;
};