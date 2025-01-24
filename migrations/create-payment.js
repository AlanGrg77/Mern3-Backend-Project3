"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.addColumn("payments","pidx",{
    type : Sequelize.STRING,
   })
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payments");
  },
};
