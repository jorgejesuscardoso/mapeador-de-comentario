import puppeteer from "puppeteer";
import { Container } from "./style";

const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', // ou o caminho correto para o Chrome na sua máquina
});
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://developer.chrome.com/');

    // Set screen size.
    await page.setViewport({width: 1080, height: 1024});

    // Type into search box.
    await page.locator('.devsite-search-field').fill('automate beyond recorder');

    // Wait and click on first result.
    await page.locator('.devsite-result-item-link').click();

    // Locate the full title with a unique string.
    const textSelector = await page
    .locator('text/Customize and automate')
    .waitHandle();
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // Print the full title.
    console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close(); 

const FindComments = async () => {
    // Launch the browser and open a new blank page
       
    
    return (
        <Container>
            <button
                className="btn btn-primary"
            >
                Buscar Comentários
            </button>
        </Container>
    );

};

export default FindComments;