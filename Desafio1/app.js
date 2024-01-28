const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send('Bem vindo ao meu web service!');
  });

const porta = 3000;

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });