# mapeador-de-comentario
Este app mapeia os comentarios em uma determinada pagina do wattpad


# Descrição do Projeto: Mapeador de Comentários no Wattpad

Este projeto é um **mapeador de comentários** que coleta e organiza comentários de capítulos específicos de livros no site **Wattpad**.

## Funcionalidade:
1. **Inserção do link**: O administrador do projeto (ou **ADM**) insere o link referente ao livro desejado no Wattpad.
2. **Coleta de capítulos**: O bot acessa a página do livro no Wattpad e recupera todos os capítulos disponíveis.
3. **Seleção de capítulo**: A ADM escolhe um capítulo específico para realizar a coleta de comentários.
4. **Opções de filtro**: Após escolher o capítulo, a ADM tem duas opções:
   - **Comentários sem filtro**: O bot retorna todos os comentários feitos no capítulo selecionado, sem nenhum filtro.
   - **Comentários de um usuário específico**: Caso a ADM escolha essa opção, o bot filtra os comentários de um usuário específico e retorna apenas os comentários dessa pessoa no capítulo escolhido.

## Objetivo:
Este projeto visa facilitar o acompanhamento e a análise de interações específicas dos leitores em capítulos selecionados, permitindo que os administradores do grupo (normalmente em plataformas como o **WhatsApp**) organizem e monitorem comentários de maneira mais eficiente.

## Tecnologias envolvidas:
- **Web scraping**: Uso de bibliotecas como **BeautifulSoup** (Python) ou **Cheerio** (Node.js) para fazer a extração de dados da página do Wattpad.
- **Automação**: Dependendo da abordagem, pode-se usar ferramentas como **Selenium** para navegar nas páginas dinamicamente ou **requests** para páginas estáticas.
