#!/bin/sh
echo "Rodando migrations..."
npx prisma generate  # Ajuste conforme seu ORM (Se estiver usando Prisma)

echo "Iniciando aplicação..."
npm start # Ou outro comando necessário para iniciar o servidor
