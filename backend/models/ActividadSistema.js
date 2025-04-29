const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const ActividadSistema = sequelize.define('ActividadSistema', {
  id_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  tipo_actividad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_actividad: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
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
  tableName: 'ActividadSistema',
  timestamps: false
});

module.exports = ActividadSistema;
