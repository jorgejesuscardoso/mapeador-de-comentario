import express, { Request, Response } from 'express';
import { FindBook, getParagraph, RobozinhoV3 } from '../../robot/robo.v3';

const bot = express.Router();

bot.post('/getComments', async (req: Request, res: Response) => {
    try {
        const url = req.body.wUrl as string;
        console.log('Robô iniciado...');
        const wUser = req.body.wUser as string;
        const resultado = await RobozinhoV3(wUser, url); // O Robozinho deve retornar os dados coletados
        if(!resultado) return console.log("Erro ao buscar comentários.");

        res.status(200).json(resultado);
        return;
    } catch (error) {
        console.error('Erro ao executar o robô:', error);
        res.status(500).json({ error: 'Erro ao executar o robô', details: error });
    }
});

bot.post('/getBooks', async (req, res) => {
  try {
    const { body } = req.body; // espera-se: [{ book_id: '123' }, { book_id: '456' }, ...]
    
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'Formato inválido. Esperado array de objetos com book_id.' });
    }

    const results = await Promise.allSettled(
      body.map(item => FindBook(item.book_id))
    );

    const livrosSucesso = results
      .map((result, index) => {
        if (result.status === 'fulfilled') return result.value;
        console.warn(`❌ Falha ao buscar o livro com ID ${body[index].book_id}:`, result.reason);
        return null;
      })
      .filter(Boolean); // remove os nulls

    res.json(livrosSucesso);
  } catch (error) {
    console.error('Erro geral ao buscar livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

bot.get('/paragraphs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await getParagraph(id);
        res.json(resultado);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
    };
})

export default bot;