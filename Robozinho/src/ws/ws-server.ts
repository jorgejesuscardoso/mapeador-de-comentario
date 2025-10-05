import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { decodeToken, verifyPreToken, verifySessionToken, verifyWsToken } from '../configs/jwt';

const SECRET_KEY = process.env.LUNAR_KEY || '0800';
const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

interface WSData {
  type: string;
  token?: string;
}

wss.on('connection', (ws) => {
  console.log('Cliente conectado via WS');

  // Recebe mensagens do front
  ws.on('message', async (msg) => {
    let data: WSData;

    try {
      data = JSON.parse(msg.toString());
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: 'Formato inválido' }));
      return;
    }


    if (data.type === 'auth' && data.token) {
      try {
        // Apenas decode do token
        const verify = verifyWsToken(data.token) as any;
      if(!verify) {
        ws.send(JSON.stringify({
          type: 'auth',
          status: 401,
          message: "Voce foi desconectado! Efetue login novamente."
        }));        
        ws.close(4001, 'Token inválido'); 
        return
      }
        // Token válido → envia ok
        ws.send(JSON.stringify({
          type: 'auth',
          status: 'ok',
        }));
      } catch (err) {
        // Token inválido ou expirado → avisa front
        ws.send(JSON.stringify({
          type: 'auth',
          status: 'invalid',
          message: 'Token inválido ou expirado, relogue por favor'
        }));
        
        ws.close(4001, 'Token inválido');
      }
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log(`WebSocket rodando em ws://localhost:${PORT}`);
