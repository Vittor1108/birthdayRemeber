// Importação do express
const express = require("express");
const app = express();

//Importação da tabela Aniversariantes
const usauriosTable = require("./database/Aniversariantes");

// Importação e Conexão com o banco de dados
const connection = require("./database/database");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o BD!");
  })
  .catch((error) => {
    console.log("conexão negada");
  });

//Importação do bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View Engine
app.set("view engine", "ejs");
// Pasta de arquivos estaticos
app.use(express.static("public"));

// Rotas
app.get("/", (req, res) => {
  // Pega todos os dados da table e retorna em um array de OBJ
  usauriosTable.findAll({ raw: true }).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas,
    });
  });
});

app.get("/cadastrar", (req, res) => {
  res.render("cadastro");
});

app.post("/salvarcadastro", (req, res) => {
  const nomeAniversariante = req.body.nomeAniversariante;

  // Formatação data
  let dataAniversario = req.body.dataAniversario;
  dataAniversario = dataAniversario.split("-");
  dataAniversario.reverse();
  dataAniversario = dataAniversario.join("/");
  const email = req.body.email;
  const dataNascimento = req.body.dataNascimento;
  const data = new Date();
  const idade = data.getFullYear() - dataNascimento;

  // Create Salva dados em uma tabela.
  usauriosTable
    .create({
      nome: nomeAniversariante,
      aniversario: dataAniversario,
      email: email,
      nascimento: idade,
    })
    .then(() => {
      res.redirect("/");
    });
});

app.post("/deletar", (req, res) => {
  const id = req.body.id;

  if (id !== undefined) {

    if (!isNaN(id)) {
        usauriosTable.destroy({
            where:{
                id: id
            }
        }).then(()=>{
            res.redirect("/");
        })
    }else{
        res.redirect("/");
    };

  } else {
        res.redirect("/");
  }
});

// Inicio do servidor
app.listen(8080);
