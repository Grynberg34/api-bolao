const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Seleção = connection.define('Seleção', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  nome: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  img: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  grupo: { 
    type: DataTypes.STRING,
    allowNull: true
  },
},{
  tableName: 'seleções'
});

module.exports = Seleção;
