# Use uma imagem base oficial do Node.js
FROM node:20

# Instalar as dependências necessárias para o Playwright funcionar corretamente
RUN apt-get update && apt-get install -y \
wget \
ca-certificates \
fonts-liberation \
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
chromium \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Definir variáveis de ambiente para o Playwright e Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/lib/chromium-browser/


# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json (se presente) para dentro do container
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código-fonte do projeto para dentro do container
COPY . .

# Expôr a porta em que o Express estará rodando
# Copiar o entrypoint e dar permissão de execução
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expôr a porta do servidor
EXPOSE 3000

# Definir o entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
