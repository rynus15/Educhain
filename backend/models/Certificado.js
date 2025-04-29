const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estudiante = require('./Estudiante');
const Institucion = require('./Institucion');

const Certificado = sequelize.define('Certificado', {
  id_certificado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_institucion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Institucion,
      key: 'id_institucion'
    }
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estudiante,
      key: 'id_estudiante'
    }
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  programa_academico: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fecha_emision: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_finalizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  promedio: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  creditos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'REVOCADO', 'SUSPENDIDO'),
    allowNull: false,
    defaultValue: 'ACTIVO'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  archivo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Certificado',
  timestamps: false
});

module.exports = Certificado;
