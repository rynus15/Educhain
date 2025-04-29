const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Certificado = sequelize.define('Certificado', {
  idCertificado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  idInstitucion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEstudiante: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Certificado',
  timestamps: false
});

module.exports = Certificado;
