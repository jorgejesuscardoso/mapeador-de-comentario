/* eslint-disable @typescript-eslint/no-explicit-any */

const endPoint = 'https://projlunar.onrender.com';
//const endPoint = 'https://0a20-170-84-225-220.ngrok-free.app';
//const endPoint = 'http://localhost:6060';
//const endPoint = 'https://mapeador-de-comentario-production.up.railway.app';

export const CreateBook = async (book: {title: string, wUrl: string, memberId: number}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/book`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book,
            }),
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

export const UpdateBook = async (id: number, update: {title: string, wUrl: string, memberId: number}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/book/${id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                update,
            }),
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
};

export const DeleteBook = async (id: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/book/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            signal: controller.signal,
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
};
    