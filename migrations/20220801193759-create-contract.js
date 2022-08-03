'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documentId: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.TEXT
      },
      partyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Parties',
          key: 'id',
        },
      },
      documentNumber: {
        type: Sequelize.TEXT
      },
      productCode: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      endDate: {
        type: Sequelize.DATEONLY
      },
      term: {
        type: Sequelize.INTEGER
      },
      policyYearNum: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contracts');
  }
};
