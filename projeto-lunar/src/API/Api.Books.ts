/* eslint-disable @typescript-eslint/no-explicit-any */

import { UrlBase } from "./UrlBase";

const endPoint = UrlBase.ngrok;

const token: string | null = localStorage.getItem('token');
const cleanToken = token ? token.replace(/"/g, '') : null;

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
                'Authorization': `Bearer ${cleanToken}`
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
                'Authorization': `Bearer ${cleanToken}`
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
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
    