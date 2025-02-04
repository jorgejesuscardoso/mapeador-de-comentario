const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Abre o navegador visível para debug
    const page = await browser.newPage();

    // URL do capítulo do Wattpad (mude para seu link)
    const url = 'https://www.wattpad.com/1501648271-darkbonds-cap%C3%ADtulo-2-o-ataque-ao-culto';
    await page.goto(url, { waitUntil: 'networkidle2' });
    const botaoClasse = '.show-more-btn'

    let tentativas = 0;
    while (tentativas < 1) { // Evita loop infinito
        const botaoExiste = await page.$(botaoClasse); // Verifica se o botão ainda está na página
        if (!botaoExiste) break; // Sai do loop se o botão sumiu

        console.log(`🔄 Clicando no botão para carregar mais comentários... (${tentativas + 1})`);
        await botaoExiste.click(); // Clica no botão
        await new Promise(r => setTimeout(r, 3000)); // Espera os novos comentários carregarem
        tentativas++;
    }


    // Simula rolagem para carregar mais comentários
    let previousHeight;
    for (let i = 0; i < 5; i++) {  // Ajuste a quantidade de scrolls conforme necessário
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await new Promise(r => setTimeout(r, 3000)); // Espera carregar novos comentários
        let newHeight = await page.evaluate('document.body.scrollHeight');
        //if (newHeight === previousHeight) break; // Para quando não houver mais conteúdo carregando
    }

    // Coletando comentários
    const comentarios = await page.evaluate(() => {
        let elements = document.querySelectorAll('.comment-card-container'); // Ajuste o seletor conforme necessário
        let data = [];
        elements.forEach(el => {
            let usuario = el.querySelector('.title-action')?.innerText || "Desconhecido";
            let comentario = el.querySelector('.text-body-sm')?.innerText || "Sem texto";
            let postDate = el.querySelector('.postedDate__xcq5D')?.innerText || "Sem texto";

            

            function calcularHorario(tempoRelativo, horaAtual) {
                let data = new Date(horaAtual); // Começa com a hora atual do sistema
            
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
            
                // **Formata a hora para HH:mm**
                let horas = data.getHours().toString().padStart(2, '0');
                let minutos = data.getMinutes().toString().padStart(2, '0');
            
                return `${horas}:${minutos}`; // Retorna no formato HH:mm
            }

            let dataFormatada = calcularHorario(postDate, new Date().toISOString());
            //dataFormatada.toString();

            data.push({ usuario, comentario, dataFormatada });
        });
        return data;
    });


    console.log(comentarios);

    // Salva os dados em um arquivo JSON
    fs.writeFileSync('comentarios.json', JSON.stringify(comentarios, null, 2));

    await browser.close();
})();
