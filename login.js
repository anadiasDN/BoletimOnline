const $ = (elemento) => document.querySelector(elemento);

document.querySelector("#entrar").addEventListener("click", (ev) => {
  ev.preventDefault();

  const login = $("#login").value;
  const senha = $("#senha").value;

  
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ login, senha })
  })
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert(data.erro);
        return;
      }

    localStorage.setItem("tipo", data.usuario.tipo);
    localStorage.setItem("login", data.usuario.login);

      alert("Login bem-sucedido!");
      window.location.href = "./logado.html";
    })
    .catch(() => alert("Erro ao fazer login"));
});
