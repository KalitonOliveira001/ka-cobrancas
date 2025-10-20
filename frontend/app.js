// ----------------------------------------------------
// 1. CONFIGURAÇÃO BASE
// ----------------------------------------------------
// O endereço do seu Backend (API) que está online!
const API_URL = 'https://ka-cobrancas-production.up.railway.app'; 

// Variável para armazenar o ID do cliente logado (por enquanto, usaremos 1)
let logado = false; // Estado inicial

// ----------------------------------------------------
// 2. LÓGICA DE ALTERNÂNCIA ENTRE TELAS
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Referências às seções
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const switchLink = document.getElementById('switch-link');
    const authMessage = document.getElementById('auth-message');
    
    // Esconde o cadastro no início
    if (registerSection) {
        registerSection.style.display = 'none';
    }

    // Lógica para alternar entre Login e Cadastro
    if (switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (loginSection.style.display !== 'none') {
                // Troca para Cadastro
                loginSection.style.display = 'none';
                registerSection.style.display = 'block';
                authMessage.textContent = 'Já tem uma conta?';
                switchLink.textContent = 'Faça login';
            } else {
                // Troca para Login
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
                authMessage.textContent = 'Não tem uma conta?';
                switchLink.textContent = 'Cadastre-se';
            }
        });
    }

    // Função para mostrar a tela do aplicativo
    function showAppScreen() {
        if (authContainer) authContainer.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        // Tenta carregar os clientes assim que a tela principal é mostrada
        listarClientes(); 
    }

    // >>>>>>>>>> CORREÇÃO TEMPORÁRIA: FORÇAR A TELA DO APLICATIVO PARA TESTAR A CONEXÃO <<<<<<<<<<
    showAppScreen();
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
});

// ----------------------------------------------------
// 3. LÓGICA PARA LISTAR CLIENTES (GET)
// ----------------------------------------------------
function listarClientes() {
    const tabelaCorpo = document.getElementById('clientes-tabela-corpo'); 
    if (!tabelaCorpo) return; // Garante que o elemento existe

    tabelaCorpo.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px;">Buscando dados no servidor...</td></tr>';

    // 1. Faz a chamada GET para o Backend
    fetch(`${API_URL}/clientes`) 
        .then(resposta => {
            if (!resposta.ok) {
                // Captura erros de rede ou CORS (403 Forbidden)
                throw new Error('Erro na conexão. Status: ' + resposta.status);
            }
            return resposta.json();
        })
        .then(clientes => {
            tabelaCorpo.innerHTML = ''; // Limpa a mensagem de carregamento

            if (clientes.length === 0) {
                 tabelaCorpo.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px;">Nenhum cliente cadastrado.</td></tr>';
                 return;
            }

            // 2. Preenche a tabela com os clientes
            clientes.forEach(cliente => {
                const linha = tabelaCorpo.insertRow();
                
                linha.insertCell().textContent = cliente.id;
                linha.insertCell().textContent = cliente.nome;
                linha.insertCell().textContent = cliente.email;
                
                // Botões de Ação
                const celulaAcoes = linha.insertCell();
                celulaAcoes.style.textAlign = 'center';
                
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'action-button btn-edit';
                
                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.className = 'action-button btn-delete';
                
                celulaAcoes.appendChild(btnEditar);
                celulaAcoes.appendChild(btnExcluir);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            tabelaCorpo.innerHTML = `<tr><td colspan="4" style="color: red; padding: 10px;">ERRO DE CONEXÃO: ${error.message}. Verifique os logs do Railway e a regra CORS no Backend.</td></tr>`;
        });
}

// ----------------------------------------------------
// 4. LÓGICA DE CADASTRO E LOGIN (Esboço)
// ----------------------------------------------------
// Esta será nossa próxima etapa real.
```
eof

## 2. Comandos do Terminal (Passo a Passo)

Agora, salve o `app.js` no VS Code e execute os comandos Git na sua pasta `frontend`:

1.  **Adicionar as Mudanças:**
    ```bash
    git add .
    ```

2.  **Criar o Commit:**
    ```bash
    git commit -m "fix: Forca exibicao da tela de clientes para teste de conexao"
    ```

3.  **Enviar para o Railway:**
    ```bash
    git push origin main
    