const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', '36272097', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;