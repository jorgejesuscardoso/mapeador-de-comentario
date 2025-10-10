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

export const createBook = async (formdata: FormData) => {
  try {
    const controller = new AbortController();

    const response = await axios.post(
      `${endPoint}/create`,
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

export const updateBook = async (formdata: FormData, id: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.patch(
      `${endPoint}/update/${id}`,
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

//CHAPTERS
export const createChapters = async (bookId: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPointChapters}/create/${bookId}`,
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

export const getChapterLunarToReadById = async (bookId: string, chapterId: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.get(
      `${endPointChapters}/read/${bookId}/${chapterId}`,
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
    const msg = err?.response?.data?.error || 'Erro inesperado no salvamento do capítulo.';
    throw new Error(msg);
  }
};

export const deleteChapterLunarById = async (bookId: string, chapterId: string) => {
  try {
    const controller = new AbortController();

    const response = await axios.delete(
      `${endPointChapters}/${bookId}/${chapterId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    return response;
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado ao excluir capítulo.';
    throw new Error(msg);
  }
};
