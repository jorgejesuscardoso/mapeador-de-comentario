import app from './app';
import './ws/ws-server'

const port = 6060;

app.listen(port, '0.0.0.0', () => {
  console.log(`O servidor está rodando na porta: ${port}`);
});

