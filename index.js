const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));


app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/cadastrar", (req, res)=>{
    res.render('cadastro');
})

app.listen(8080);