'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('jogos','grupo', {
      type: DataTypes.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('jogos', 'grupo');
  }
};

