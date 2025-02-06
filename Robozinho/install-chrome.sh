#!/bin/bash
# Baixar e instalar o Google Chrome no Render

echo "Instalando Chrome..."
apt-get update && apt-get install -y wget unzip
wget -q -O /tmp/chrome.zip https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i /tmp/chrome.zip || apt-get install -fy
rm /tmp/chrome.zip

echo "Chrome instalado!"
