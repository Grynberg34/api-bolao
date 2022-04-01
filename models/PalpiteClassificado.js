const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Seleção = require('./Seleção');

const PalpiteClassificado = connection.define('PalpiteClassificado', {
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
  }
},{
  tableName: 'palpites_classificados'
});

PalpiteClassificado.belongsTo(Seleção, {foreignKey: 'seleçãoId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PalpiteClassificado.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PalpiteClassificado;
