import app from './app';

const port = 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`O servidor está rodando na porta: ${port}`);
});

