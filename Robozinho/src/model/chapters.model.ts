import db from "../db";
import { GetCommand, ScanCommand, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { getBookById } from "./book.model";

const tableName = 'booksLunar';
const tableChapterName = 'chaptersBookLunar2'

export const getAllChapterByBookId = async (bookId: string, chapterId: string) => {
  try {
    if (!bookId) {
      return { error: 'bookId é obrigatório!' };
    }

    const data = await getBookById(bookId) as any;

    if (!data?.chapters) {
      return { error: 'Nenhum capítulo encontrado!' };
    }

    // Encontra índice do capítulo atual
    const index = data.chapters.findIndex((ch: any) => ch.id === chapterId);

    if (index === -1) {
      return { error: 'Capítulo não encontrado!' };
    }

    const currentChapter = data.chapters[index];
    const nextChapter = data.chapters[index + 1] || null;

    if(nextChapter && nextChapter.id) {
      const formatedData = {
        cover: data.cover, 
        name: data.name,
        currentChapter,
        nextPart: nextChapter.id ?? null, // pode ser null se for último
      };
      return formatedData;
  }
  
  const formatedDataNoId = {
        cover: data.cover, 
        name: data.name,
        currentChapter,
      };

    return formatedDataNoId;
  } catch (err) {
    console.error(err);
    return { error: 'Erro ao buscar capítulo' };
  }
};
