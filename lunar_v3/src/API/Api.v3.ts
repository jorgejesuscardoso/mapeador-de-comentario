/* eslint-disable @typescript-eslint/no-explicit-any */

import { UrlBase } from './Base.url'

const endPoint = UrlBase.prod;
const token: string | null = localStorage.getItem('token');
const cleanToken = token ? token.replace(/"/g, '') : null;


export const getComments = async (wUser: string, wUrl: string) => {
    const controller = new AbortController();
    //const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/books`;
    try {
        const body = {
            wUser,
            wUrl
        }

        const response = await fetch(url, {
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
    }
}

export const getBooks = async (id: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout    
    const url = `${endPoint}/books/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET'
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
