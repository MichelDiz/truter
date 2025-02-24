# Truter
Desafio Truter* (fake name)

# Setup necessário

Docker e Docker Compose. Mais nada.

# Instruções

1. Garanta que em backend/scripts/ não tenha o arquivo .init_done - Sempre que for reiniciar do zero precisa deletar esse check.
2. Execute `compose down -v && docker compose up --build` na raiz isso vai inicializar o front e o backend juntos. O backend termina mais rápido, o front pode demorar dependendo da máquina. React é assim mesmo. Na minha levou 38 segundos.
3. Acesse http://localhost:4000/ para a API GraphQL.
4. Acesse http://localhost:5173/ para acessar o Frontend.


# Rodando Testes e2e

Basta rodar `bash runtTests.sh` e aguardar o processo.
