const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CertificadoBlockchain = sequelize.define('CertificadoBlockchain', {
  idCertificadoBlockchain: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCertificado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  hash: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'CertificadoBlockchain',
  timestamps: false
});

module.exports = CertificadoBlockchain;
