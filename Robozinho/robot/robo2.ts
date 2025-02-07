import { chromium } from 'playwright';
import os from 'os';

// Or import puppeteer from 'puppeteer-core';

export const Robozinho2 = async (wUser: string, wUrl: string, click: number) => {
    async function Robot() {
        const browser = await chromium.launch({
            headless: true,
            executablePath: os.platform() === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });        
        
        console.log('URL:', wUrl);
        const page = await browser.newPage();
        console.log('Acessando a página...');
        await page.goto(wUrl, { waitUntil: 'networkidle' });
    
        // **Rolagem até o fim da página**
        console.log('Rolando até achar o botão "Exibir mais"...');
       
        await page.evaluate(() => document.body.scrollHeight);

        await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (button) button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, '.show-more-btn');
        
    
        // **Clicando no botão "Carregar mais comentários" se necessário**
        let clickCount = 0;
        while (clickCount < click) {

            await page.waitForSelector('.show-more-btn', { timeout: 3000 });
            const button = await page.$('.show-more-btn');

            if (!button) {
                console.log('Botão não encontrado!');
                break;
            }
            const isVisible = await button.isVisible();
            if (!isVisible) {
                console.log('Botão está oculto ou invisível!');
                break;
            }
    
            console.log('Carregando mais comentários...');
            await button.click();
            await page.waitForTimeout(3000);
            clickCount++;
        }
    
        // **Coletando comentários**
        console.log('Extraindo comentários...');
        const comentariosNovos = await page.evaluate((wUser: string) => {
            let elements = document.querySelectorAll('.comment-card-container');
            let data = [] as any[];
    
            function calcularHorario(tempoRelativo: string, horaAtual: string) {
                let data = new Date(horaAtual);
                if (tempoRelativo.includes("Agora")) {
                    let segundos = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setSeconds(data.getSeconds() - segundos);
                } else if (tempoRelativo.includes("min")) {
                    let minutos = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setMinutes(data.getMinutes() - minutos);
                } else if (tempoRelativo.includes("h")) {
                    let horas = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setHours(data.getHours() - horas);
                } else if (tempoRelativo.includes("ontem")) {
                    data.setDate(data.getDate() - 1);
                } else if (tempoRelativo.includes("dia")) {
                    let dias = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setDate(data.getDate() - dias);
                } else if (tempoRelativo.includes("sem")) {
                    let semanas = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setDate(data.getDate() - semanas * 7);
                } else if (tempoRelativo.includes("mês")) {
                    let meses = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setMonth(data.getMonth() - meses);
                } else if (tempoRelativo.includes("ano")) {
                    let anos = parseInt(tempoRelativo.match(/\d+/)?.[0] || "0");
                    data.setFullYear(data.getFullYear() - anos);
                }
                return `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
            }
    
            elements.forEach(el => {
                let usuario = (el.querySelector('.title-action') as HTMLElement)?.innerText || "Desconhecido";
                let comentario = (el.querySelector('.text-body-sm') as HTMLElement)?.innerText || "Sem texto";
                let postDate = (el.querySelector('.postedDate__xcq5D') as HTMLElement)?.innerText || "Sem texto";
                let dataFormatada = calcularHorario(postDate, new Date().toISOString());
    
                if (usuario === wUser) {
                    data.push({ usuario, comentario, dataFormatada });
                }
            });
    
            return data;
        }, wUser);
    
        console.log(`Total de comentários extraídos: ${comentariosNovos.length}`);
        await browser.close();
        return comentariosNovos;
    }

    return Robot();
};

export const FindBook = async (book: string) => {
    async function Book() {
        const browser = await chromium.launch({
            headless: true,
            executablePath: os.platform() === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    
        const page = await browser.newPage();
        console.log('Acessando a página...');
        await page.goto(book, { waitUntil: 'networkidle' });

        // **Clinando em "Começar a ler"**

        console.log('Clicando em "Começar a ler"...');
        await page.waitForSelector('.oMHIt', { timeout: 3000 });
        const button = await page.$('.oMHIt');
        if (!button) {
            console.log('Botão não encontrado!');
        }
        await button?.click();
        await page.waitForTimeout(3000);

        // // **Verifica se url mudou**
        // const urlAtual = page.url();
        // if (urlAtual === book) {
        //     console.log('URL não mudou!');
        // } else {
        //     return { url: urlAtual };
        // }
        // **Coletando quantidade de capítulos**

        console.log('Extraindo quantidade de capítulos...');
        await page.waitForSelector('.fa', { timeout: 3000 });
        
        console.log('Listando capítulos...');
        

        // **Capturar href e InnerText dos capítulos**
        const capitulos = await page.evaluate(() => {
            const chapters = Array.from(document.querySelectorAll('.table-of-contents li a')).map(a => {
                const titleElement = a.querySelector('.part-title');
                return {
                    href: a.getAttribute('href'),
                    title: titleElement && titleElement.textContent ? titleElement.textContent.trim() : "Título não encontrado"
                };
            });
        
            return chapters;
        });

        // **Retornar quantidade de capítulos e desliga o bot**

        console.log(`Total de capítulos: ${capitulos.length}`);
        return capitulos;
    }
    return Book();
};
