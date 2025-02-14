import app from './app';

const port = 3060;

app.listen(port, '0.0.0.0', () => {
  console.log(`O servidor está rodando na porta: ${port}`);
});

