document.addEventListener("DOMContentLoaded", () => {
  const tipo = localStorage.getItem("tipo");
  const login = localStorage.getItem("login");
  const linhas = document.querySelectorAll("tbody tr");

  // 💡 Se for aluno, buscar as notas no banco e preencher a tabela
  if (tipo === "aluno") {
    fetch(`http://localhost:3000/notas/${login}`)
      .then(res => res.json())
      .then(dados => {
        dados.forEach(nota => {
          const linha = [...linhas].find(tr =>
            tr.children[0].textContent.trim() === nota.materia
          );

          if (linha) {
            const inputs = linha.querySelectorAll("input.nota");
            inputs[0].value = nota.bimestre1;
            inputs[1].value = nota.bimestre2;
            inputs[2].value = nota.bimestre3;
            inputs[3].value = nota.bimestre4;
            const somaSpan = linha.querySelector(".soma");
            somaSpan.textContent = nota.soma.toFixed(2);

            // ❌ Impede edição pelo aluno
            inputs.forEach(input => {
              input.setAttribute("readonly", true);
              input.style.backgroundColor = "#f1f1f1";
            });
          }
        });

        // Oculta o botão de salvar para aluno
        const botaoSalvar = document.getElementById("salvar");
        if (botaoSalvar) botaoSalvar.style.display = "none";
      })
      .catch(() => alert("Erro ao carregar notas do aluno"));
  }

  // 🧑‍🏫 Se for professor, permitir edição e salvar
  if (tipo === "professor") {
    linhas.forEach((linha) => {
      const inputs = linha.querySelectorAll("input.nota");
      const somaSpan = linha.querySelector(".soma");

      inputs.forEach(input => {
        input.addEventListener("input", () => {
          const notas = Array.from(inputs).map(i => parseFloat(i.value) || 0);
          const soma = notas.reduce((a, b) => a + b, 0);
          somaSpan.textContent = soma.toFixed(2);
        });
      });
    });

    document.querySelector("#salvar").addEventListener("click", () => {
      const aluno = prompt("Digite o login do aluno:");
      const dados = [];

      document.querySelectorAll("tbody tr").forEach(tr => {
        const materia = tr.querySelector("td").textContent;
        const notas = tr.querySelectorAll("input.nota");
        const valores = Array.from(notas).map(n => parseFloat(n.value) || 0);
        const soma = valores.reduce((a, b) => a + b, 0);

        dados.push({
          aluno_login: aluno,
          materia,
          bimestre1: valores[0],
          bimestre2: valores[1],
          bimestre3: valores[2],
          bimestre4: valores[3],
          soma
        });
      });

      fetch("http://localhost:3000/salvar-notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })
        .then(res => res.json())
        .then(msg => alert(msg.mensagem || "Notas salvas com sucesso"))
        .catch(() => alert("Erro ao salvar notas"));
    });
  }
});
