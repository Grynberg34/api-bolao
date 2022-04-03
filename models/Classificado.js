const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Seleção = require('./Seleção');
const User = require('./User');

const Classificado = connection.define('Classificado', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  fase: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
},{
  tableName: 'classificados'
});

Classificado.belongsTo(Seleção, {foreignKey: 'seleçãoId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = Classificado;
