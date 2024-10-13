const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres', // or 'mysql' or other database dialect you're using
});

module.exports = sequelize;
