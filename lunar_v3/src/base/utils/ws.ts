import { toast } from '@/base/utils/toast';
import { useRouter } from 'vue-router';

const router = useRouter()

let ws: WebSocket | null = null;

export function startWebSocket() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  if (!userData.token) return;

  ws = new WebSocket('ws://localhost:8080'); // endereço do seu WS

  ws.onopen = () => {
    console.log('WS conectado!');
    // envia token para autenticar
    ws!.send(JSON.stringify({ type: 'auth', token: userData.token }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Mensagem WS recebida:', data);

    if (data.type === 'auth' && data.status === 'invalid') {
      // Token inválido → limpa sessão e avisa
      localStorage.removeItem('user');
      //toast.warning("Você foi desconectado, relogue por favor!");
      if (ws) {
        ws.close();
        ws = null;
      }
      
      setTimeout(() => {window.location.pathname='/login'}, 2000)
    }
  };

  ws.onclose = () => {
    console.log('WS desconectado');
    ws = null;

    //localStorage.removeItem('user');
    //toast.warning("Você foi desconectado, relogue por favor!");
    if (ws) {
      ws.close();
      ws = null;
    }
  
    //setTimeout(() => {window.location.pathname='/login'}, 2000)
  };

  ws.onerror = (err) => {
    console.error('Erro no WS', err);
  };

  // ping a cada 30s pra manter sessão ativa
  const interval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'auth', token: userData.token }));
    } else {
      clearInterval(interval); // para de tentar se WS não estiver aberto
    }
  }, 30_000);
}
