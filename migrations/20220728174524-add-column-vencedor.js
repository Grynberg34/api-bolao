'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('palpites_jogos','vencedor', {
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
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('palpites_jogos', 'vencedor');
  }
};
