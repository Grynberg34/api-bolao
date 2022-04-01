const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  nome: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  email: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  google_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  tipo_conta: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
},{
  tableName: 'users'
});

module.exports = User;
