const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Jogo = require('./Jogo');
const User = require('./User');
const Seleção = require('./Seleção');

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
    allowNull: true
  },
  s2_placar: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
},{
  tableName: 'palpites_jogos'
});

PalpiteJogo.belongsTo(Seleção, {foreignKey: 'vencedor', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteJogo.belongsTo(Seleção, {as:'s1', foreignKey: 's1_id', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteJogo.belongsTo(Seleção, {as:'s2', foreignKey: 's2_id', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteJogo.belongsTo(Jogo, {foreignKey: 'jogoId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteJogo.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PalpiteJogo;
