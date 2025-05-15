const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',       
  database: 'boletim' 
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});


app.post('/cadastro', (req, res) => {
  const { nome, email, login, senha, tipo } = req.body;
  const sql = 'INSERT INTO usuarios (nome, email, login, senha, tipo) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nome, email, login, senha, tipo], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar' });
    res.json({ mensagem: 'Usuário cadastrado com sucesso' });
  });
});


app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE login = ? AND senha = ?';
  db.query(sql, [login, senha], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao fazer login' });
    if (results.length === 0) return res.status(401).json({ erro: 'Login ou senha incorretos' });
    res.json({ mensagem: 'Login bem-sucedido', usuario: results[0] });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


app.post('/salvar-notas', (req, res) => {
  const notas = req.body;

  const sql = `REPLACE INTO notas 
    (aluno_login, materia, bimestre1, bimestre2, bimestre3, bimestre4, soma)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  notas.forEach(nota => {
    db.query(sql, [
      nota.aluno_login,
      nota.materia,
      nota.bimestre1,
      nota.bimestre2,
      nota.bimestre3,
      nota.bimestre4,
      nota.soma
    ], (err) => {
      if (err) console.error("Erro ao salvar nota:", err);
    });
  });

  res.json({ mensagem: "Notas salvas com sucesso!" });
});

app.get('/notas/:login', (req, res) => {
  const login = req.params.login;
  const sql = 'SELECT * FROM notas WHERE aluno_login = ?';

  db.query(sql, [login], (err, results) => {
    if (err) {
      console.error("Erro ao buscar notas:", err);
      return res.status(500).json({ erro: 'Erro ao buscar notas' });
    }
    res.json(results);
  });
});
