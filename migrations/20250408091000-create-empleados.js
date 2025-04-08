"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("empleados", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      puesto: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellidos: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cedula: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      rh: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      fecha_expedicion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      lugar_nacimiento: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lugar_expedicion: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      edad: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      estado_civil: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["Soltero", "Casado", "Union Libre"]],
        },
      },
      escolaridad: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isIn: [["Primaria", "Secundaria", "Pregrado", "Postgrado"]],
        },
      },
      curso_vigilancia: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      fecha_vencimiento_curso: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      telefono1: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      arl: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      eps: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      pension: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cargo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      medio_tiempo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tiempo_completo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_finalizacion: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      ingreso: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("empleados");
  },
};