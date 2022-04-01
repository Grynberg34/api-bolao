const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Jogo = require('./Jogo');
const User = require('./User');

const PalpiteJogo = connection.define('PalpiteJogo', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  s1_placar: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  s2_placar: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
},{
  tableName: 'palpites_jogos'
});

PalpiteJogo.belongsTo(Jogo, {foreignKey: 'jogoId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteJogo.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PalpiteJogo;
