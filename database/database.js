// Importação do Sequelize
const Sequelize = require('sequelize');

// Conexão com Sequelize
const connection = new Sequelize('birthdayremeber', 'root', '10121416Davi.',{
    host: 'localhost',
    dialect: 'mysql'
});

// Exporta a conexão
module.exports = connection