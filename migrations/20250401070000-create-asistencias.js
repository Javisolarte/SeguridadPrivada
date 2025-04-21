"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("asistencias", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      empleado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empleados",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      turno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "turnos",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      hora_ingreso: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      hora_salida: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    await queryInterface.dropTable("asistencias");
  },
};