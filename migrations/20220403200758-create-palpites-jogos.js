'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('palpites_jogos', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      s1_placar: { 
        type: DataTypes.INTEGER,
        allowNull: true
      },
      s2_placar: { 
        type: DataTypes.INTEGER,
        allowNull: true
      },
      jogoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'jogos'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      }, 
      {
        tableName: 'palpites_jogos'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('palpites_jogos');
  }
};