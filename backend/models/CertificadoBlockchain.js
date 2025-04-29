const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Certificado = require('./Certificado');

const CertificadoBlockchain = sequelize.define('CertificadoBlockchain', {
  id_blockchain: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_certificado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Certificado,
      key: 'id_certificado'
    }
  },
  hash_certificado: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  direccion_contrato: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  id_transaccion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  bloque: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'CertificadoBlockchain',
  timestamps: false
});

module.exports = CertificadoBlockchain;
