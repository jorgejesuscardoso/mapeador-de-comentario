import puppeteer from 'puppeteer';
import fs from 'fs';
import os from 'os';
// Or import puppeteer from 'puppeteer-core';

const Robozinho = async () => {
async function Robot () {
    const isWindows = os.platform() === 'win32'; // Verifica se está rodando no Windows
        const chromePath = isWindows
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Caminho do Chrome no Windows
            : '/usr/bin/google-chrome-stable'; // Caminho do Chrome no Linux/Render

        const browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: true
        });
    
        const page = await browser.newPage();
    
        // URL do capítulo do Wattpad (mude para seu link)
        const url = 'https://www.wattpad.com/1503437794-darkbonds-cap%C3%ADtulo-3-1-alvorada';
        await page.goto(url, { waitUntil: 'networkidle2' });
    
        // Rolando até o final da página
        let previousHeight;
        for (let i = 0; i < 100; i++) {  // Ajuste a quantidade de scrolls conforme necessário
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await new Promise(r => setTimeout(r, 3000)); // Espera carregar novos comentários
            let newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === previousHeight) break; // Para quando não houver mais conteúdo carregando
        }
    
        // Verificando se existe o botão de "Carregar mais comentários" e clicando nele
        let loadMoreButtonVisible = true;
    
        let clickAttempts = 0; // Contador para evitar loop infinito

        while (loadMoreButtonVisible && clickAttempts < 5) { // Limitar tentativas de clique
        try {
            // Espera até o botão "Carregar mais comentários" aparecer e ficar visível
            await page.waitForSelector('.show-more-btn', { visible: true, timeout: 5000 }); // Espera até 5 segundos para o botão aparecer
            const button = await page.$('.show-more-btn'); // Seletor para o botão "Carregar mais"
            if (button) {
                console.log('Carregando mais comentários...');
                await button.click();  // Clica no botão de "Carregar mais"
                await new Promise(resolve => setTimeout(resolve, 3000));  // Espera 3 segundos para carregar novos comentários
                clickAttempts += 1; // Incrementa o contador de tentativas               
            } else {
            console.log('Botão de "Carregar mais" não encontrado ou não é mais clicável.');
            loadMoreButtonVisible = false;  // Para o loop quando o botão não estiver mais disponível
            break;
            }
        } catch (err) {
            console.log('Erro ao clicar no botão "Carregar mais":', err);
            loadMoreButtonVisible = false;
        }
        } // Fim do loop de clique
    
        // Coletar comentários após carregamento
        if (loadMoreButtonVisible === false) {
            console.log('Carregamento de comentários finalizado.');
            const comentariosNovos = await page.evaluate(() => {
                let elements = document.querySelectorAll('.comment-card-container'); // Ajuste o seletor conforme necessário
                let data = [] as any[];
                elements.forEach(el => {
                    let usuario = (el.querySelector('.title-action') as HTMLElement)?.innerText || "Desconhecido";
                    let comentario = (el.querySelector('.text-body-sm') as HTMLElement)?.innerText || "Sem texto";
                    let postDate = (el.querySelector('.postedDate__xcq5D') as HTMLElement)?.innerText || "Sem texto";
        
                    function calcularHorario(tempoRelativo: any, horaAtual: any) {
                        let data = new Date(horaAtual); // Começa com a hora atual do sistema
                        console.log('Ajustando os horários dos comentários...');
                        if (tempoRelativo.includes("Agora")) {
                            let segundos = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setSeconds(data.getSeconds() - segundos);
                        } else if (tempoRelativo.includes("min")) {
                            let minutos = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setMinutes(data.getMinutes() - minutos);
                        } else if (tempoRelativo.includes("h")) {
                            let horas = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setHours(data.getHours() - horas);
                        } else if (tempoRelativo.includes("ontem")) {
                            data.setDate(data.getDate() - 1);
                        } else if (tempoRelativo.includes("dia")) {
                            let dias = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setDate(data.getDate() - dias);
                        } else if (tempoRelativo.includes("sem")) {
                            let semanas = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setDate(data.getDate() - semanas * 7);
                        } else if (tempoRelativo.includes("mês")) {
                            let meses = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setMonth(data.getMonth() - meses);
                        } else if (tempoRelativo.includes("ano")) {
                            let anos = parseInt(tempoRelativo.match(/\d+/)[0]) || 0;
                            data.setFullYear(data.getFullYear() - anos);
                        }
                    
                        let horas = data.getHours().toString().padStart(2, '0');
                        let minutos = data.getMinutes().toString().padStart(2, '0');
                    
                        return `${horas}:${minutos}`; // Retorna no formato HH:mm
                    }
        
                    let dataFormatada = calcularHorario(postDate, new Date().toISOString());
        
                    data.push({ usuario, comentario, dataFormatada });
                });
                return data;
            });
        
    
        let comentarios = []; // Array para armazenar os comentários
        console.log('Comentários novos coletados com sucesso:', comentariosNovos.length);
        comentarios.push(...comentariosNovos); // Adiciona os novos comentários ao array original
    
        // Não feche o browser ainda. Se você quiser continuar interagindo com o navegador ou fazer mais ações, deixe-o aberto.
    
        // Apenas ao final, quando terminar tudo:
        await browser.close();
        return comentarios;
     }
    }

    return Robot();
};

export default Robozinho;