"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("horarios_rotativos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      punto_seguridad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "puntos_seguridad", // Esto está correcto, ya que la tabla es "puntos_seguridad"
          key: "id",
        },
        onDelete: "CASCADE",
      },
      empleado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "empleados", // Esto está correcto, ya que la tabla es "empleados"
          key: "id",
        },
        onDelete: "CASCADE",
      },
      turno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "turnos", // Cambiado de "turnos" a "Turnos" para que coincida con la base de datos
          key: "id",
        },
        onDelete: "CASCADE",
      },
      fecha: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable("horarios_rotativos");
  },
};