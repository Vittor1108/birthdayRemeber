// <============================= Importação do express ======================>
const express = require("express");
const app = express();

// <============================= Importação do multer ======================>
const date = new Date();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + date.getUTCHours() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// <============================= Importação tabela de aniversariantes ==================>
const usauriosTable = require("./database/Aniversariantes");

// <============================= Conexão BD  ===========================================>
const connection = require("./database/database");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o BD!");
  })
  .catch((error) => {
    console.log("conexão negada");
  });

// <============================= BodyParser ==============================================>
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// <============================= View Engie ===============================================>
app.set("view engine", "ejs");
// <============================= STATIC ===================================================>
app.use(express.static("public"));
// <============================= Importação fileSystem ====================================>
const fs = require("fs");
// <============================= Importação do Moment =====================================>
const moment = require("moment");
// <============================= Rotas =====================================================>
app.get("/", (req, res) => {
  // Pega todos os dados da table e retorna em um array de OBJ
  usauriosTable.findAll({ raw: true, order: [['']]}).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas,
    });
  });
});

app.get("/cadastrar", (req, res) => {
  res.render("cadastro");
});

app.post("/salvarcadastro", upload.single("file"), (req, res) => {
  const nomeAniversariante = req.body.nomeAniversariante;

  // Formatação data
  let dataAniversario = req.body.dataAniversario;
  dataAniversario = dataAniversario.split("-");
  dataAniversario.reverse();
  dataAniversario = `${dataAniversario.join("/")}`;

  // d1
  const dataNascimento = req.body.dataNascimento;
  const data = new Date();
  let idade = data.getFullYear() - dataNascimento;
  
  const dia = data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`;
  const mes = (data.getMonth()+1) > 9 ? data.getMonth() : `0${data.getMonth()+1}`;
  const ano = date.getFullYear();

  // d2
  const dataAtual = `${dia}/${mes}/${ano}`;
  const diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(dataAniversario,"DD/MM/YYYY"));
  const dias = moment.duration(diff).asDays();
  idade = dias > 0 ? idade = idade - 1 : idade = idade;


  const email = req.body.email;
  const nameFile = req.body.nameFile;

  // Create Salva dados em uma tabela.
  usauriosTable
    .create({
      nome: nomeAniversariante,
      aniversario: dataAniversario,
      email: email,
      nascimento: idade,
      fileName: nameFile,
    })
    .then(() => {
      res.redirect("/");
    });
});

app.post("/deletar", (req, res) => {

  const id = req.body.id;
  const fileName = req.body.fileName;

  if (id !== undefined) {
    if (!isNaN(id)) {

      fs.unlink(`./public/uploads/${fileName}`, function(err){
        if(err) throw err;
      });

      usauriosTable
        .destroy({
          where: {
            id: id,
          },
        })
        .then(() => {
          res.redirect("/");
        });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  };
});
app.listen(8080);
