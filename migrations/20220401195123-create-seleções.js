'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('seleções', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      nome: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      img: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      grupo: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      }, 
      {
        tableName: 'seleções'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seleções');
  }
};
