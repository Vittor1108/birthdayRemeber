const Sequelize = require('sequelize');
const connection = require("./database");

const Usuarios = connection.define("usuarios", {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },

    aniversario:{
        type: Sequelize.STRING,
        allowNull: false
    },

    email:{
        type: Sequelize.STRING,
    },

    nascimento:{
        type: Sequelize.STRING,
    }   
});


// Impede a reacriação da tabela caso ela já exista
Usuarios.sync({force: false}).then(()=>{});

module.exports = Usuarios;