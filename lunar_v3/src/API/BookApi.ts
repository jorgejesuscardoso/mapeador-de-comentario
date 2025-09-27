/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'
import { mockUser } from '@/base/cards/mock'

const endPoint = UrlBase.prod


export const RegisterBook = async (data: any) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/books/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
   throw new Error(
      err.response?.data?.error || err.response?.data?.message || 'Erro inesperado no registro'
    )
  }
}

export const getBooksAws = async () => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/books/`, {
      method: 'GET'})
 
    return response.data
  } catch (err: any) {
   throw new Error(
      err.response?.data?.error || err.response?.data?.message || 'Erro inesperado no registro'
    )
  }
}

export const feed = async () => {
  const data = mockUser.map((s) => ({
    user: s.autor,
    bookUrl: s.id,
    bookName: s.name
  }));

  try {
    const results = await Promise.allSettled(
      data.map(d => axios.post(`${endPoint}/books/feed`, d))
    );

    const successResponses = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<any>).value.data);

    const failed = results.filter(r => r.status === 'rejected');

    console.log('✅ Sucesso:', successResponses.length);
    console.log('❌ Falharam:', failed.length);
    if (failed.length > 0) {
      console.warn('Erros nas requisições:', failed);
    }

    return successResponses;
  } catch (err) {
    console.error('Erro inesperado no feed:', err);
    return [];
  }
};
