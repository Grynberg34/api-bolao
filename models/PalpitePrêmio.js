const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Prêmio = require('./Prêmio');
const User = require('./User');

const PalpitePrêmio = connection.define('PalpitePrêmio', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  ganhador: { 
    type: DataTypes.STRING,
    allowNull: true
  },
},{
  tableName: 'palpites_prêmios'
});

PalpitePrêmio.belongsTo(Prêmio, {foreignKey: 'prêmioId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpitePrêmio.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PalpitePrêmio;
