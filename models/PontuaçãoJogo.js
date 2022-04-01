const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Jogo = require('./Jogo');
const User = require('./User');

const PontuaçãoJogo = connection.define('PontuaçãoJogo', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  pontos: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
},{
  tableName: 'pontuações_jogos'
});

PontuaçãoJogo.belongsTo(Jogo, {foreignKey: 'jogoId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PontuaçãoJogo.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PontuaçãoJogo;
