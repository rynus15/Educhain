const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Verificacion = sequelize.define('Verificacion', {
  idVerificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCertificado: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaVerificacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  resultado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  detalles: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'Verificacion',
  timestamps: false
});

module.exports = Verificacion;
