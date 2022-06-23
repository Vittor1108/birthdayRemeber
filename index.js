// Importação do express
const express = require('express');
const app = express(); 

//Importação da tabela Aniversariantes
const usauriosTable = require("./database/Aniversariantes")

// Importação e Conexão com o banco de dados
const connection = require("./database/database");
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o BD!")
    })
    .catch(error =>{
        console.log('conexão negada');
    });

//Importação do bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Importação do Multer
const multer = require('multer');


// View Engine
app.set("view engine", "ejs");
// Pasta de arquivos estaticos
app.use(express.static('public'));

// Rotas
app.get("/", (req, res)=>{
    // Pega todos os dados da table e retorna em um array de OBJ
    usauriosTable.findAll({raw: true}).then(perguntas =>{
        res.render("index",{
            perguntas:perguntas,
        });
    })
});

app.get("/cadastrar", (req, res)=>{
    res.render('cadastro');
});

app.post("/salvarcadastro", multer(multerConfig).single('file'), (req, res)=>{
    const nomeAniversariante = req.body.nomeAniversariante;
    const dataAniversario = req.body.dataAniversario;
    const email = req.body.email;
    const dataNascimento = req.body.dataNascimento;
    console.log(req.file);
    // Create Salva dados em uma tabela.
    usauriosTable.create({
        nome: nomeAniversariante,
        aniversario: dataAniversario,
        email: email,
        nascimento: dataNascimento
    }).then(()=>{
        res.redirect("/");
    });
});

// Inicio do servidor
app.listen(8080);