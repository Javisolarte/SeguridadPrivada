"use strict";
   /** @type {import('sequelize-cli').Migration} */
   module.exports = {
     async up(queryInterface, Sequelize) {
       await queryInterface.createTable("clientes", {
         id: {
           allowNull: false,
           autoIncrement: true,
           primaryKey: true,
           type: Sequelize.INTEGER,
         },
         nombre: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         direccion: {
           type: Sequelize.STRING,
           allowNull: true,
         },
         telefono: {
           type: Sequelize.STRING,
           allowNull: true,
         },
         email: {
           type: Sequelize.STRING,
           allowNull: true,
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
       await queryInterface.dropTable("clientes");
     },
   };