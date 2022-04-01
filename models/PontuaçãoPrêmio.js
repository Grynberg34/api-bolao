const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Prêmio = require('./Prêmio');
const User = require('./User');

const PontuaçãoPrêmio = connection.define('PontuaçãoPrêmio', {
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
  tableName: 'pontuações_prêmios'
});

PontuaçãoPrêmio.belongsTo(Prêmio, {foreignKey: 'prêmioId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PontuaçãoPrêmio.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PontuaçãoPrêmio;
