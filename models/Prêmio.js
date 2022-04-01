const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Prêmio = connection.define('Prêmio', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  prêmio: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  ganhador: { 
    type: DataTypes.STRING,
    allowNull: true
  },
},{
  tableName: 'prêmios'
});

module.exports = Prêmio;
