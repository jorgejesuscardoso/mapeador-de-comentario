import db from "../db";
import { GetCommand, ScanCommand, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const tableName = 'booksLunar';
const tableChapterName = 'chaptersBookLunar2'

export const getBookById = async (id: string) => {
  try {

    if (!id) {
      return { error: 'O id é obrigátorio!' };
    }

    
    // 1. Buscar o livro
    const bookResult = await db.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: id.trim() }
      })
    );

    
    if (!bookResult.Item || bookResult.Item.isDeleted) {
      return { error: 'Livro não encontrado' };
    }

    // 2. Buscar capítulos do livro
    const chaptersResult = await db.send(
      new QueryCommand({
        TableName: tableChapterName,
        KeyConditionExpression: "bookId = :bookId",
        ExpressionAttributeValues: {
          ":bookId": id.trim()
        }
      })
    );
    
    // 3. Calcular métricas agregadas
    let totalViews = 0;
    let totalVotes = 0;
    let totalComments = 0;

    chaptersResult.Items?.forEach((chapter: any) => {
      totalViews += parseInt(chapter.views || 0, 10);
      totalVotes += parseInt(chapter.votes || 0, 10);
      totalComments += chapter.comments?.length || 0;
    });

    // 4. Montar resposta
    const response = {
      ...bookResult.Item,
      chapters: chaptersResult.Items || [],
      views: totalViews,
      votes: totalVotes,
      commentsTotal: totalComments
    };

    return response || { error: 'Erro ao buscar livro' };
  } catch (err) {
    console.error(err);
  }
}