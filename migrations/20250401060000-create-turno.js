"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { // Añadido async
    await queryInterface.createTable("turnos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      empleadoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "empleados",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      clienteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "clientes",
          key: "id",
        },
        onDelete: "CASCADE",
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
  async down(queryInterface, Sequelize) { // Añadido async
    await queryInterface.dropTable("turnos");
  },
};