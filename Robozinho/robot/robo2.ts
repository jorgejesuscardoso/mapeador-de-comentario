import { chromium, firefox } from 'playwright';

export const Robozinho2 = async (wUser: string, wUrl: string, click: number) => {
    async function Robot() {
        const browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('URL:', wUrl);
        const page = await browser.newPage();

        console.log('Acessando a página...');
        await page.goto(wUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        console.log('Rolando até achar o botão "Exibir mais"...');
        await page.evaluate(() => {
            return new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 200;
                const delay = 300;

                const scrollInterval = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    const scrollHeight = document.body.scrollHeight;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(scrollInterval);
                        resolve();
                    }

                    if (document.querySelector('.show-more-btn button')) {
                        clearInterval(scrollInterval);
                        resolve();
                    }
                }, delay);
            });
        });

        console.log('Rolagem finalizada!');
        
        let clickCount = 0;
        while (clickCount < click) {
            try {
                const button = await page.waitForSelector('.show-more-btn', { timeout: 7000 }).catch(() => null);

                if (!button) {
                    console.log('Botão "Exibir mais" não encontrado. Prosseguindo...');
                    break;
                }

                console.log('Carregando mais comentários. Número de clicks: ', clickCount + 1);
                await button.click({ force: true });
                await page.waitForTimeout(5000);
                clickCount++;
            } catch (error) {
                console.log('Erro ao clicar no botão! Prosseguindo com a coleta dos comentários...');
                break;
            }
        }

        console.log(`Extraindo comentários do usuário ${wUser}`);
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

                if (wUser && !usuario.includes(wUser)) return;

                if (usuario === wUser) {
                    data.push({ usuario, comentario, dataFormatada });
                    return;
                }

                data.push({ usuario, comentario, dataFormatada });

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
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Buscando o livro no endereço: ',book);
    
        const page = await browser.newPage();
        console.log('Acessando a página...');
        await page.goto(book, { waitUntil: 'networkidle' });

        // **Clicando em "Começar a ler"**

        // console.log('Clicando em "Começar a ler"...');
        // try {
        //     await page.waitForSelector('.BSch2', { timeout: 3000 });
        //     const button = await page.$('.oMHIt');
        //     if (!button) {
        //         console.log('Botão não encontrado!');
        //     }
        //     await button?.click();
        //     await page.waitForTimeout(3000);
        // } catch (error) {
        //     console.log('Erro ao clicar no botão!');            
        // }

        // // **Verifica se url mudou**
        // const urlAtual = page.url();
        // if (urlAtual === book) {
        //     console.log('URL não mudou!');
        // } else {
        //     return { url: urlAtual };
        // }
        // **Coletando quantidade de capítulos**

        // console.log('Extraindo quantidade de capítulos...');
        // await page.waitForSelector('.fa', { timeout: 30000 });

        
        console.log('Livro encontrado!');
        

        const capitulos = await page.evaluate(() => {
            console.log('Listando capítulos...');
            
            return Array.from(document.querySelectorAll('li a._6qJpE')).map(a => {
                const titleElement = a.querySelector('.wpYp-'); // Pegando a div correta
                return {
                    href: a.getAttribute('href'),
                    title: titleElement?.textContent?.trim() || "Título não encontrado"
                };
            });
        });
        

        // **Retornar quantidade de capítulos e desliga o bot**

        await browser.close();
        console.log(`Total de capítulos: ${capitulos.length}`);
        return capitulos;
    }
    return Book();
};
