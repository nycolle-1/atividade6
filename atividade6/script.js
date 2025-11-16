const API_URL = "https://proweb.leoproti.com.br/alunos";

document.addEventListener("DOMContentLoaded", () => {
    carregarAlunos();

    document.getElementById("alunoForm").addEventListener("submit", salvarAluno);
    document.getElementById("btnCancelar").addEventListener("click", limparFormulario);
});


//-------------------------------------------------------------------------------------
async function carregarAlunos() {
    const resposta = await fetch(API_URL);
    const alunos = await resposta.json();

    const tbody = document.querySelector("#tabelaAlunos tbody");
    tbody.innerHTML = "";

    alunos.forEach(aluno => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.turma}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.matricula}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarAluno(${aluno.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirAluno(${aluno.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


//-------------------------------------------------------------------------------------
async function salvarAluno(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const aluno = {
        nome: document.getElementById("nome").value,
        turma: document.getElementById("turma").value,
        curso: document.getElementById("curso").value,
        matricula: document.getElementById("matricula").value
    };

    let metodo = "POST";
    let url = API_URL;

    if (id) {
        metodo = "PUT";
        url = `${API_URL}/${id}`;
    }

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
    });

    limparFormulario();
    carregarAlunos();
}


//-------------------------------------------------------------------------------------
async function editarAluno(id) {
    const resposta = await fetch(`${API_URL}/${id}`);
    const aluno = await resposta.json();

    document.getElementById("id").value = aluno.id;
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("turma").value = aluno.turma;
    document.getElementById("curso").value = aluno.curso;
    document.getElementById("matricula").value = aluno.matricula;

    document.getElementById("btnCancelar").classList.remove("d-none");
}


//-------------------------------------------------------------------------------------
async function excluirAluno(id) {
    if (!confirm("Deseja realmente excluir este aluno?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarAlunos();
}


//-------------------------------------------------------------------------------------
function limparFormulario() {
    document.getElementById("alunoForm").reset();
    document.getElementById("id").value = "";
    document.getElementById("btnCancelar").classList.add("d-none");
}
