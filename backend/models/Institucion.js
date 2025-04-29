const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Institucion = sequelize.define('Institucion', {
  idInstitucion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreInstitucion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Institucion',
  timestamps: false
});

module.exports = Institucion;
