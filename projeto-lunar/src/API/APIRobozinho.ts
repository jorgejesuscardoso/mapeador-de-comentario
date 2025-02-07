export const Robozinho = async (wUser: string, wUrl: string, click: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    //const endPoint = 'https://mapeador-de-comentario.onrender.com/bot';
    const localEndPoint = 'http://localhost:3000/bot';
    try {
        const body = {
            wUser,
            wUrl,
            click
        }

        const response = await fetch(localEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar comentários.");
    } finally {
        clearTimeout(timeout);
    }
}

export const FindBooks = async (book: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    //const endPoint = 'https://mapeador-de-comentario.onrender.com/books';
    const localEndPoint = 'http://localhost:3000/books';
    try {
        const body = {
            book
        }

        const response = await fetch(localEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}

export const LoginApi = async (user: string, pass: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const endPoint = 'https://mapeador-de-comentario.onrender.com/auth';
    //const localEndPoint = 'http://localhost:3000/auth';
    try {
        const body = {
            user,
            pass
        }

        const response = await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}
