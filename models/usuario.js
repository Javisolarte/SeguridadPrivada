const bcrypt = require("bcryptjs");
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Definir relaciones si es necesario
    }

    // Método para encriptar la contraseña
    static async encriptarContraseña(contraseña) {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(contraseña, salt);
    }

    // Método para validar la contraseña
    static async validarContraseña(contraseña, contraseñaEncriptada) {
      return bcrypt.compare(contraseña, contraseñaEncriptada);
    }
  }

  Usuario.init(
    {
      nombre: DataTypes.STRING,
      email: DataTypes.STRING,
      contraseña: DataTypes.STRING,
      rol: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Usuario",
    }
  );

  return Usuario;
};
