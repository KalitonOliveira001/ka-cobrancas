// O endereço do seu Backend (API) que está online!
const API_URL = 'https://ka-cobrancas-production.up.railway.app';

// ----------------------------------------------------
// 1. Lógica para alternar entre as telas de Login e Cadastro
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Pega as caixinhas de Login e Cadastro e o link de troca
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const switchLink = document.getElementById('switch-link');

    // Se essas caixinhas existirem, a lógica começa
    if (loginSection && registerSection && switchLink) {
        registerSection.style.display = 'none'; // Esconde o cadastro no início

        // Faz o clique no link trocar as telas
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginSection.style.display !== 'none') {
                loginSection.style.display = 'none';
                registerSection.style.display = 'block';
                switchLink.textContent = 'Já tem uma conta? Faça Login';
            } else {
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
                switchLink.textContent = 'Não tem uma conta? Cadastre-se';
            }
        });

        // ----------------------------------------------------
        // 2. Lógica de Envio do Formulário (CONEXÃO COM O BACKEND)
        // ----------------------------------------------------

        // Esta função envia os dados para o seu Spring Boot
        const handleFormSubmit = async (event, endpoint) => {
            event.preventDefault();
            const form = event.target;
            const email = form.querySelector('input[name="email"]').value;
            const password = form.querySelector('input[name="password"]').value;

            // Campos adicionais para cadastro (se existirem)
            const nameInput = form.querySelector('input[name="name"]');
            const name = nameInput ? nameInput.value : undefined;

            try {
                // AQUI está a conexão com o seu Backend online!
                const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(`Sucesso! ${endpoint.includes('login') ? 'Login' : 'Cadastro'} realizado.`);
                    // A partir daqui, você pode navegar o usuário para a próxima página.
                } else {
                    const error = await response.json();
                    alert(`Erro na requisição: ${error.message || response.statusText}`);
                }
            } catch (error) {
                alert('Erro de conexão com o servidor. Verifique o console.');
                console.error('Erro de conexão:', error);
            }
        };

        // Faz o botão de Login e Cadastro chamarem a função acima
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/login'));
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => handleFormSubmit(e, '/api/register'));
        }
    }
});