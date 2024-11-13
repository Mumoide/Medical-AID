const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: 'localhost',
    port: process.env.PG_PORT || 5433,
    dialect: 'postgres', // or 'mysql' or other database dialect you're using
    timezone: '-03:00',
});

module.exports = sequelize;
