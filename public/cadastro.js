const $ = (elemento) => document.querySelector(elemento);

document.querySelector("#cadastro").addEventListener("click", (ev) => {
  ev.preventDefault();

  const nome = $("#nome").value;
  const email = $("#email").value;
  const login = $("#login").value;
  const senha = $("#senha").value;
  const confirmaSenha = $("#confirma-senha").value;
  const tipo = $("#tipo").value;

  if (senha !== confirmaSenha) {
    alert("Confirmação de senha incorreta.");
    return;
  }

  
  fetch("http://localhost:3000/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, login, senha, tipo })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensagem || "Cadastro realizado!");
      window.location.href = "./index.html";
    })
    .catch(() => alert("Erro ao cadastrar"));
});

