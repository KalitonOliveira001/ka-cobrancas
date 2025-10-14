KA DADOS - Pacote completo (backend + frontend) - Guia passo a passo

1) Baixe este ZIP e extraia em C:\DevTools\ka-cobrancas_complete

2) Instale Docker Desktop (veja instruções já fornecidas anteriormente).

3) Abra PowerShell e execute:
   cd C:\DevTools\ka-cobrancas_complete
   docker compose up --build

4) Aguarde e abra:
   http://localhost:8080  (frontend)
   http://localhost:8081/api/clientes (backend)

5) Criar cliente (exemplo):
   curl -X POST http://localhost:8081/api/clientes/cadastro -H "Content-Type: application/json" -d "{"nome":"Cliente Teste","email":"cliente@exemplo.com","senha":"1234"}"

6) Iniciar no STS:
   File -> Import -> Maven -> Existing Maven Projects -> escolha pasta backend -> Finish -> Run As -> Spring Boot App (KaBackendApplication)

7) Iniciar frontend no VS Code:
   File -> Open Folder -> escolha frontend -> abra index.html para editar. Para servir localmente sem Docker, use Live Server extension or a simple static server.

Se precisar, envie a mensagem com o erro e eu te ajudo passo a passo.
