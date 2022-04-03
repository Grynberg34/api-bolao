const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Seleção = require('./Seleção');

const Jogo = connection.define('Jogo', {
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
},{
  tableName: 'jogos'
});

Jogo.belongsTo(Seleção, {as: "s1_id", foreignKey: 's1_id', onUpdate: 'cascade', onDelete: 'CASCADE'});
Jogo.belongsTo(Seleção, {as: "s2_id", foreignKey: 's2_id', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = Jogo;
