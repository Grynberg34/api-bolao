'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      nome: { 
          type: DataTypes.STRING,
          allowNull: true,
      },
      email: { 
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: true
      },
      google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      token_redefinir: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      tipo_conta: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
      },
      pix: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enviado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      }, 
      {
        tableName: 'users'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
