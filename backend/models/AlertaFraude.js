const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AlertaFraude = sequelize.define('AlertaFraude', {
  idAlertaFraude: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idVerificacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idCertificado: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaAlerta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'AlertaFraude',
  timestamps: false
});

module.exports = AlertaFraude;
