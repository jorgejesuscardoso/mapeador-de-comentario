# Use uma imagem base oficial do Node.js
FROM node:18-slim

# Instalar as dependências necessárias para o Playwright funcionar corretamente
RUN apt-get update && apt-get install -y \
libnss3 \
libatk-bridge2.0-0 \
libatk1.0-0 \
libcups2 \
libdbus-1-3 \
libgdk-pixbuf2.0-0 \
libnspr4 \
libx11-xcb1 \
libxcomposite1 \
libxdamage1 \
libxrandr2 \
libgbm1 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libatspi2.0-0 \
fonts-liberation \
libappindicator3-1 \
libasound2 \
libxtst6 \
xdg-utils \
libxss1 \
libnss3-dev \
&& rm -rf /var/lib/apt/lists/*

# Instalar o Chromium (necessário para o Playwright)
RUN apt-get install -y chromium

# Definir variáveis de ambiente para o Playwright e o Chromium
ENV CHROME_BIN=/usr/bin/chromium

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json (se presente) para dentro do container
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código-fonte do projeto para dentro do container
COPY . .

# Expôr a porta em que o Express estará rodando
EXPOSE 3000

# Definir o comando para rodar o seu app Express
CMD ["npm", "start"]
