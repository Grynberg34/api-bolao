const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Classificado = require('./Classificado');

const PontuaçãoClassificado = connection.define('PontuaçãoClassificado', {
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
  tableName: 'pontuações_classificados'
});

PontuaçãoClassificado.belongsTo(Classificado, {foreignKey: 'classificadoId', onUpdate: 'cascade', onDelete: 'CASCADE'});
PontuaçãoClassificado.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = PontuaçãoClassificado;
