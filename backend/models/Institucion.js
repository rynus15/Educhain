const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Institucion = sequelize.define('Institucion', {
  id_institucion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  nombre_institucion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  codigo_acreditacion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Institucion',
  timestamps: false
});

module.exports = Institucion;
