// ----------------------------------------------------
// 1. CONFIGURAÇÃO BASE
// ----------------------------------------------------
// VERIFIQUE SE ESTA URL ESTÁ CORRETA (Backend - Ka-Cobrancas)
// Se o seu backend mudou de nome, você deve mudar AQUI.
const API_URL = 'https://ka-cobrancas-production.up.railway.app'; 

// Variáveis de estado
let logado = false;
let authToken = null; 

// ----------------------------------------------------
// 2. LÓGICA DE ALTERNÂNCIA ENTRE TELAS
// ----------------------------------------------------
function showAuthScreen() {
    logado = false;
    authToken = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('app-container').style.display = 'none';
}

function showAppScreen() {
    logado = true; 
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    // Tenta carregar os clientes assim que a tela principal é mostrada
    listarClientes(); 
}

// Função auxiliar para exibir mensagens de erro/sucesso
function showMessage(form, message, isError = true) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    const msg = document.createElement('p');
    msg.className = 'form-message';
    msg.textContent = message;
    msg.style.color = isError ? '#e53e3e' : '#38a169'; // Cores Tailwind (vermelho/verde)
    msg.style.marginTop = '10px';
    msg.style.textAlign = 'center';
    msg.style.padding = '5px';
    msg.style.borderRadius = '5px';
    form.appendChild(msg);
}

// ----------------------------------------------------
// 3. LÓGICA DE CADASTRO (POST /clientes)
// ----------------------------------------------------
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        nome: form.name.value,
        email: form.email.value,
        senha: form.password.value,
    };
    
    showMessage(form, 'Cadastrando...', false);

    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(form, 'Cadastro realizado com sucesso! Faça login.', false);
            // Após o cadastro, muda para a tela de login
            document.getElementById('switch-link').click(); 
        } else {
            // Se o servidor retornar uma mensagem de erro, exibe
            const errorMessage = result.message || 'Erro no cadastro. Tente novamente.';
            showMessage(form, errorMessage, true);
        }
    } catch (error) {
        console.error('Erro de rede/conexão:', error);
        showMessage(form, 'Erro de conexão com o servidor. Verifique se o Backend está ativo.', true);
    }
}

// ----------------------------------------------------
// 4. LÓGICA DE LOGIN (POST /login)
// ----------------------------------------------------
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        email: form.email.value,
        senha: form.password.value,
    };
    
    showMessage(form, 'Fazendo login...', false);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // Sucesso no login: salva o token e mostra a tela principal
            authToken = result.token; // O token deve vir do backend
            showMessage(form, 'Login bem-sucedido!', false);
            showAppScreen();
        } else {
            // Se o servidor retornar uma mensagem de erro, exibe
            const errorMessage = result.message || 'Email ou senha incorretos.';
            showMessage(form, errorMessage, true);
        }
    } catch (error) {
        console.error('Erro de rede/conexão:', error);
        showMessage(form, 'Erro de conexão com o servidor. Verifique se o Backend está ativo.', true);
    }
}


// ----------------------------------------------------
// 5. LÓGICA PARA LISTAR CLIENTES (GET /clientes)
// ----------------------------------------------------
// Torna a função global para o botão "Recarregar" poder chamá-la
window.listarClientes = function() { 
    const tabelaCorpo = document.getElementById('clientes-tabela-corpo'); 
    if (!tabelaCorpo) return; 

    tabelaCorpo.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px;">Buscando dados no servidor...</td></tr>';

    // 1. Faz a chamada GET para o Backend
    fetch(`${API_URL}/clientes`, {
        method: 'GET',
        headers: {
            // Necessário enviar o token de autorização
            'Authorization': `Bearer ${authToken}` 
        }
    }) 
    .then(resposta => {
        if (resposta.status === 401 || resposta.status === 403) {
             throw new Error('Não autorizado. Faça login novamente.');
        }
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}: Falha ao buscar dados.`);
        }
        return resposta.json();
    })
    .then(clientes => {
        tabelaCorpo.innerHTML = ''; 

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
            btnEditar.className = 'action-button bg-yellow-500 hover:bg-yellow-600';
            
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'action-button bg-red-500 hover:bg-red-600 ml-2';
            
            celulaAcoes.appendChild(btnEditar);
            celulaAcoes.appendChild(btnExcluir);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        tabelaCorpo.innerHTML = `<tr><td colspan="4" style="color: red; padding: 10px;">ERRO DE CONEXÃO: ${error.message}.</td></tr>`;
        if (error.message.includes('Não autorizado')) {
            // Redireciona para o login se o token falhar
            showAuthScreen(); 
        }
    });
}

// ----------------------------------------------------
// 6. INICIALIZAÇÃO DO APP (APÓS CARREGAMENTO DA PÁGINA)
// ----------------------------------------------------
window.onload = function() {
    // Referências
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const switchLink = document.getElementById('switch-link');
    const authMessage = document.getElementById('auth-message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Esconde o cadastro no início
    if (registerSection) {
        registerSection.style.display = 'none';
    }

    // Adiciona event listeners aos formulários
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }


    // Lógica para alternar entre Login e Cadastro
    if (switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove qualquer mensagem de erro ao trocar de formulário
            const loginMsg = loginForm.querySelector('.form-message');
            if(loginMsg) loginMsg.remove();
            const registerMsg = registerForm.querySelector('.form-message');
            if(registerMsg) registerMsg.remove();
            
            if (loginSection && loginSection.style.display !== 'none') {
                // Troca para Cadastro
                loginSection.style.display = 'none';
                registerSection.style.display = 'block';
                authMessage.textContent = 'Já tem uma conta?';
                switchLink.textContent = 'Faça login';
            } else if (loginSection) {
                // Troca para Login
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
                authMessage.textContent = 'Não tem uma conta?';
                switchLink.textContent = 'Cadastre-se';
            }
        });
    }

    // Começa na tela de Autenticação
    showAuthScreen();
};