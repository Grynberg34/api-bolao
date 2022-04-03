'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('classificados', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      fase: { 
        type: DataTypes.INTEGER,
        allowNull: false
      },
      }, 
      {
        tableName: 'classificados'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classificados');
  }
};