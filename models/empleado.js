const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Empleado extends Model {}

  Empleado.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      puesto: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      rh: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fecha_expedicion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      lugar_nacimiento: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lugar_expedicion: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      edad: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estado_civil: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["Soltero", "Casado", "Union Libre"]],
        },
      },
      escolaridad: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["Primaria", "Secundaria", "Pregrado", "Postgrado"]],
        },
      },
      curso_vigilancia: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fecha_vencimiento_curso: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      direccion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telefono1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      arl: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      eps: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      pension: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      cargo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      medio_tiempo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tiempo_completo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      fecha_finalizacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      ingreso: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Empleado",
      tableName: "empleados",
    }
  );

  return Empleado;
}; 