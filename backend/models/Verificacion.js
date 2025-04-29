const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Certificado = require('./Certificado');
const Usuario = require('./Usuario');

const Verificacion = sequelize.define('Verificacion', {
  id_verificacion: {
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
  id_usuario_verificador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  fecha_verificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  resultado: {
    type: DataTypes.ENUM('VALIDO', 'INVALIDO', 'REVOCADO'),
    allowNull: false
  },
  direccion_ip: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  dispositivo: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Verificacion',
  timestamps: false
});

module.exports = Verificacion;
