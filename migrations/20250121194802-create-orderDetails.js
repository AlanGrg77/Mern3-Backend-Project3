'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the column with explicit type casting
    await queryInterface.sequelize.query(`
      ALTER TABLE "orderDetails"
      ALTER COLUMN "quantity" TYPE INTEGER USING "quantity"::INTEGER;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Revert the column back to its original type, if necessary
    await queryInterface.sequelize.query(`
      ALTER TABLE "orderDetails"
      ALTER COLUMN "quantity" TYPE STRING USING "quantity"::TEXT;
    `);
  },
};
