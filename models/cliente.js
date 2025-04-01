const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Cliente extends Model {
    static associate(models) {
      // Un cliente puede tener muchos turnos asignados
      Cliente.hasMany(models.Turno, {
        foreignKey: "clienteId",
        as: "turnos",
      });
    }
  }

  Cliente.init(
    {
      nombre: DataTypes.STRING,
      direccion: DataTypes.STRING,
      contacto: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cliente",
    }
  );

  return Cliente;
};
