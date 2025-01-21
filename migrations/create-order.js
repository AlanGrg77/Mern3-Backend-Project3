const { OrderStatus } = require('../src/globals/types/index.js');  // Import the OrderStatus enum

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [10, 10],
            msg: "Phone number must have 10 digits",
          },
        },
      },
      shippingAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: Sequelize.ENUM(...Object.values(OrderStatus)), // Use the enum values from the OrderStatus enum
        defaultValue: OrderStatus.Pending, // Use the default value from the OrderStatus enum
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};
