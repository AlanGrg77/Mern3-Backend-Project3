"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "lastName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};

