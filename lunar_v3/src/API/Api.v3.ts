/* eslint-disable @typescript-eslint/no-explicit-any */

import { UrlBase } from './Base.url'
import axios from 'axios';

const endPoint = UrlBase.render;
const token: string | null = localStorage.getItem('token');
const cleanToken = token ? token.replace(/"/g, '') : null;
const pUrl = `${endPoint}/paragraphs/`

export const getComments = async (wUser: string, wUrl: string) => {
    const controller = new AbortController();
    //const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/getComments`;
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
  const timeout = setTimeout(() => controller.abort(), 15000); // 40 segundos

  const url = `${endPoint}/getBooks/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal, // ✅ isso ativa o AbortController
    });
    return response.data;
  } catch (err) {
    // ✅ lança o erro para que possa ser tratado por Promise.allSettled corretamente
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const getParagraph = async (id: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${pUrl}${id}`);    
    const html = await res.text();
    return html; // Deve ser string com <p>
  } catch (err) {
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};
