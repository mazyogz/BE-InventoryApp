const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inventory_app', 'postgres', 'ariyogi', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
