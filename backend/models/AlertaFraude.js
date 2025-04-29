const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Certificado = require('./Certificado');
const Usuario = require('./Usuario');

const AlertaFraude = sequelize.define('AlertaFraude', {
  id_alerta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_certificado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Certificado,
      key: 'id_certificado'
    }
  },
  hash_certificado: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tipo_alerta: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  severidad: {
    type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA'),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_deteccion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'INVESTIGANDO', 'RESUELTO', 'FALSO_POSITIVO'),
    allowNull: false,
    defaultValue: 'PENDIENTE'
  },
  id_usuario_reportador: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  }
}, {
  tableName: 'AlertaFraude',
  timestamps: false
});

module.exports = AlertaFraude;
