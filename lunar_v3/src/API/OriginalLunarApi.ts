/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase, UrlBaseChaptersOriginal, UrlBaseOriginal } from './Base.url'
import axios from 'axios'

const endPoint = UrlBaseOriginal.prod
const endPointChapters = UrlBaseChaptersOriginal.prod

export type TRegister = {
  user: string,
  password: string,
  name: string,
  age: number
}

//BOOKs

export const upLoadCover = async (formdata: FormData, bookId: string, bookName: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.post(
      `${endPoint}/cover?id=${encodeURIComponent(bookId)}&name=${encodeURIComponent(bookName)}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    );
    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado no upload da capa';
    throw new Error(msg);
  }
};

export const getBookLunarById = async (bookId: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPoint}/${bookId}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    );
    console.log(response)
    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado no upload da capa';
    throw new Error(msg);
  }
};

export const getBookLunar = async () => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPoint}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    );
    
    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado ao buscar os livros!';
    throw new Error(msg);
  }
};

export const getBookLunarAuthor = async (author: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPoint}/user/${author}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    );

    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado no upload da capa';
    throw new Error(msg);
  }
};


//CHAPTERS

export const getChapterLunarById = async (bookId: string, chapterId: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPointChapters}/${bookId}/${chapterId}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    ); 
    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado no upload da capa';
    throw new Error(msg);
  }
};

export const updateChapterLunarById = async (bookId: string, chapterId: string, body: any) => {
  try {
    const controller = new AbortController();

    const response = await axios.patch(
      `${endPointChapters}/${bookId}/${chapterId}`,
      {
        body,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: controller.signal
      }
    );

    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado no upload da capa';
    throw new Error(msg);
  }
};
