const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('IngSoftware', 'usuario_bd', 'password_bd', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = { sequelize };
