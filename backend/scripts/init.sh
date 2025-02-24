#!/bin/sh

echo "Aguardando o PostgreSQL iniciar..."
until nc -z postgres 5432; do
  sleep 2
done

# Rodar migrations e seed apenas na primeira vez
if [ ! -f "./scripts/.init_done" ]; then
  echo "Rodando migrations..."
  npx prisma migrate dev --name "migration_$(date +%Y%m%d_%H%M%S)"

  echo "Rodando seed para criar Super Admin..."
  npx tsx ./prisma/seed.ts

  echo "Criando usuários fictícios..."
  node ./scripts/create_users.js

  touch ./scripts/.init_done
  echo "Inicialização concluída!"
else
  echo "Banco de dados já inicializado, pulando etapa."
fi

echo "Iniciando o servidor..."
npm run start
