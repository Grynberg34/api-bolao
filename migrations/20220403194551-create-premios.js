'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('prêmios', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      prêmio: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      ganhador: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      }, 
      {
        tableName: 'prêmios'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prêmios');
  }
};