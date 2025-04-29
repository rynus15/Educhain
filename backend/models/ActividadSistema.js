const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActividadSistema = sequelize.define('ActividadSistema', {
  idActividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ActividadSistema',
  timestamps: false
});

module.exports = ActividadSistema;
