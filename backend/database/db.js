// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Lee configuración desde variables de entorno
const dbName = process.env.DB_NAME || 'educhain';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASS || 'password';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbDialect = process.env.DB_DIALECT || 'postgres';

// Crea instancia de Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: false, // Deshabilita logging SQL para claridad
});

// Exporta la instancia de conexión
module.exports = sequelize;

