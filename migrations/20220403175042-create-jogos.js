'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('jogos', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      data: { 
        type: DataTypes.DATE,
        allowNull: true
      },
      local: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      s1_placar: { 
        type: DataTypes.INTEGER,
        allowNull: true
      },
      s2_placar: { 
        type: DataTypes.INTEGER,
        allowNull: true
      },
      s1_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'seleções'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      s2_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'seleções'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      }, 
      {
        tableName: 'jogos'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jogos');
  }
};