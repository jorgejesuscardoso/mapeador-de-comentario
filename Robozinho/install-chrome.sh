#!/bin/bash
echo "Instalando Google Chrome..."

# Atualiza os pacotes e instala dependências
apt-get update
apt-get install -y wget unzip

# Baixa e instala o Google Chrome
wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i /tmp/chrome.deb || apt-get install -fy
rm /tmp/chrome.deb

echo "Google Chrome instalado com sucesso!"
